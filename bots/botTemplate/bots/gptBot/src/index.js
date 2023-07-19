const { Bot } = require('../../../lib');
const { botInitData } = require("./config/Config");
const { runCompletion } = require("./utils/Openai");
const axios = require('axios');
const fs = require('fs');
const pdf = require('pdf-parse');
const { execSync } = require("child_process");
const { v4: uuidv4 } = require("uuid");
const csv = require('csv-parser');
const pdfjsLib = require("pdfjs-dist");

// Bot initialization, the configuration is collected in the Config file (using env),
// then the already prepared data is used for initialization.
const bot = new Bot(botInitData().botData);

// The base handler that will process the user's first message
bot.use(async (context) => {

    // If we have the extracted text, we add the user's question to it and process it in openai
    if ( context.session.state.extractedText ) {
        const userJID = context.message.data.user.userJID;
        const promt = createPromt(context);

        runCompletion(promt, userJID).then(result => {
            return context.session.sendTextMessage(result);
        }).catch(error => {
            console.log("Error: ", error)
        })
    }

    // If a csv file has been received for processing, a script will be launched to unload data from it
    // and process it on the python side
    if ( context.session.state.fileUrl ) {
        const file_url = context.session.state.fileUrl
        const question = context.message.getText();

        // Processing large files takes a lot of time, so you need to write to the user to wait.
        await context.session.sendTextMessage('Please wait while I process your data...');

        // Sending a link to the file to the python side, then the script will save the file itself,
        // get data from it and then send it to openai, after that it will return the result here.
        const openaiResponse = await fetch('http://127.0.0.1:5000/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ file_url, question })
        });

        if ( !openaiResponse.ok ) {
            await context.session.sendTextMessage('An error occurred while processing your file.');
            throw new Error(`HTTP error! status: ${ openaiResponse.status }`);
        }

        const data = await openaiResponse.json();
        return context.session.sendTextMessage(String(data).trim());
    }

    // Getting the file type that the user sent to the chat
    const fileType = context.message.data.messageData.mimetype.split("/")[ 1 ];

    // If an image has been received, the process of obtaining text from this image is started,
    // after that this text is saved and the user can ask his questions.
    if ( fileType === "jpeg" || fileType === "png" ) {
        await context.session.sendTextMessage("Processing your image, please wait a few seconds...");

        //Since all the files are in ipfs we need to get them, in this situation we will use the image buffer.
        axios.get(context.message.data.messageData.location, {
            responseType: 'arraybuffer'
        }).then(response => {
            console.log("imageBuffer received");
            const imageBuffer = Buffer.from(response.data, 'binary');

            // Extracting text from an image and then saving the resulting data to a state
            const extractedText = recognizeText(imageBuffer);
            context.session.setState({ extractedText });

            return context.session.sendTextMessage("The text from your image has been received, now please ask your question.");
        }).catch(error => {
            console.error('Image upload error:', error);
            throw error;
        });
    }

    if ( fileType === "pdf" ) {
        await context.session.sendTextMessage("Processing your document, please wait a few seconds...");
        const outputDir = './output';
        const pdfURL = context.message.data.messageData.location;
        let extractedText = await extractTextFromPDF(pdfURL);

        // If a pdf is received with text instead of images, save the text to the state and send the message.
        // If not, then saving images and getting text from those images.
        if ( extractedText ) {
            context.session.setState({ extractedText });
            return context.session.sendTextMessage("The text from your document has been received, now please ask your question.");
        }

        const imageFiles = await convertPDFToImages(pdfURL, outputDir, 300);
        extractedText = await extractTextFromImages(imageFiles);
        // Deleting files
        fs.rmSync(`${ outputDir }/${ imageFiles[ 0 ].split('/')[ 2 ] }`, { recursive: true, force: true });
        // Saving the extracted text to a state
        context.session.setState({ extractedText });

        return context.session.sendTextMessage("The text from your document has been received, now please ask your question.");
    }

    if ( fileType === "csv" ) {
        const fileUrl = context.message.data.messageData.location;
        // Only the path to the file is immediately saved, further processing will occur with each user question
        context.session.setState({ fileUrl });
        return context.session.sendTextMessage("The text from your document has been received, now please ask your question.");
    }

});

// Switching the user to the allergy context step
bot.use("Context", async (context) => {
    await context.session.sendTextMessage('Context mode is on, ask questions about your allergies.');
    //User transition to the next step
    context.stepper.nextUserStep();
});

// Allergy Context Handler
bot.use(async (context) => {
    const userJID = context.message.data.user.userJID;

    // Object with data for filtering in the data API
    const filterData = {
        where: {
            user_jid: userJID,
            type: "Allergies"
        }
    }

    // Getting all user allergies from the data API
    getFilteredDataApi(filterData).then(result => {
        // Collecting all allergies in one string
        const allergiesString = createAllergiesString(result);

        // Sending a request to openai
        runCompletion(context.message.getText(), userJID, context.message.data.user.firstName, allergiesString).then(result => {
            return context.session.sendTextMessage(result);
        }).catch(error => {
            console.log("Error: ", error)
        })

    }).catch(error => {
        console.log("Get filtered dat Error: ", error)
    })
}, 1);

// Ending all processes manually by the user.
bot.use("exit", async (context) => {
    // Clearing states and sending a message that the bot has forgotten all the data.
    context.session.setState({ extractedText: "" });
    context.session.setState({ fileUrl: "" });
    context.stepper.removeNextUserStep();
    return context.session.sendTextMessage("I forgot about your file, thanks for your work!");
});

function createAllergiesString(data) {
    const allergies = data.items.map((item) => {
        const name = item.name || "Unnamed";
        const reaction = item.reaction || "Unknown reaction";
        const frequency = item.frequency || "Unknown frequency";
        return `${ name }: ${ reaction } (Frequency: ${ frequency })`;
    });
    return allergies.join(', ');
}

const getFilteredDataApi = async (params) => {
    try {
        const http = axios.create({
            baseURL: "https://app-dev.dappros.com/v1/"
        });

        const result = await http.get('data', { params });
        return result.data;
    } catch ( error ) {
        console.log(JSON.stringify(error))
        throw error;
    }
}

const createPromt = (context, processedText) => {
    const userJID = context.message.data.user.userJID;

    return (`User with id "${ userJID }", name "${ context.message.data.user.firstName }" has a question "${ context.message.getText() }", read this extracted text and answer the user's question: "${ processedText }"`);
}


const recognizeText = async (imageBuffer) => {
    // Text recognition with Tesseract
    const tesseractCommand = `tesseract stdin stdout --oem 1 --psm 3`;
    const extractedText = execSync(tesseractCommand, { input: imageBuffer }).toString().trim();
    return extractedText;
}

async function convertPDFToImages(pdfURL, outputDir, resolution = 500) {
    const uniqueFolderName = uuidv4();
    const uniqueOutputDir = `${ outputDir }/${ uniqueFolderName }`;

    if ( !fs.existsSync(outputDir) ) {
        fs.mkdirSync(outputDir);
    }
    if ( !fs.existsSync(uniqueOutputDir) ) {
        fs.mkdirSync(uniqueOutputDir);
    }

    const response = await axios.get(pdfURL, { responseType: 'arraybuffer' });
    const pdfBuffer = Buffer.from(response.data);

    const pdfFilePath = `${ outputDir }/${ uniqueFolderName }.pdf`;
    fs.writeFileSync(pdfFilePath, pdfBuffer);

    const convertCommand = `convert -density ${ resolution } "${ pdfFilePath }" "${ uniqueOutputDir }/page-%d.png"`;
    execSync(convertCommand);

    const imageFiles = fs.readdirSync(uniqueOutputDir).map((file) => `${ uniqueOutputDir }/${ file }`);
    fs.unlinkSync(pdfFilePath);

    return imageFiles;
}

async function extractTextFromImages(imageFiles) {
    const textChunks = [];

    for ( const imagePath of imageFiles ) {
        const tesseractCommand = `tesseract "${ imagePath }" stdout --oem 1 --psm 3`;
        const extractedText = execSync(tesseractCommand).toString().trim();
        textChunks.push(extractedText);
    }

    const textString = textChunks.join('\n');
    return textString;
}

// Extract plain text from pdf file
async function extractTextFromPDF(pdfPath) {
    // PDF file download
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    // PDF engine initialization
    const loadingTask = pdfjsLib.getDocument(data);
    const pdfDocument = await loadingTask.promise;

    let text = '';

    // Crawl every page of a PDF document
    for ( let i = 1; i <= pdfDocument.numPages; i++ ) {
        const page = await pdfDocument.getPage(i);
        const content = await page.getTextContent();

        // Extracting text from a page
        const pageText = content.items.map(item => item.str).join(' ');

        // Adding page text to general text
        text += pageText + ' ';
    }

    return text;
}