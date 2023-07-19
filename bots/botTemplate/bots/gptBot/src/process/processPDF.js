const axios = require('axios');
const { v4: uuidv4 } = require("uuid");
const pdfjsLib = require("pdfjs-dist");
const fs = require('fs');
const { execSync } = require("child_process");

/**
 * Processes a PDF file from a given URL.
 * This function first tries to extract text from the PDF.
 * If this fails, it converts the PDF to images and extracts the text from those images.
 * @param {object} context - The context object.
 * @param {string} pdfURL - The URL of the PDF file.
 */
const processPDF = async (context, pdfURL) => {
    // output directory for saving the extracted images from the PDF.
    const outputDir = './temp';

    // Attempt to extract text directly from the PDF.
    let extractedText = await extractTextFromPDF(pdfURL);

    // If text extraction is successful, save it to the state and return.
    if ( extractedText ) {
        context.session.setState({ extractedText });
        return context.session.sendTextMessage("The text from your document has been received, now please ask your question.");
    }

    // If text extraction fails, convert the PDF to images and extract text from the images.
    const imageFiles = await convertPDFToImages(pdfURL, outputDir, 300);
    extractedText = await extractTextFromImages(imageFiles);

    // Deleting the created image files.
    fs.rmSync(`${ outputDir }/${ imageFiles[ 0 ].split('/')[ 2 ] }`, { recursive: true, force: true });

    // Save the extracted text to the state and return.
    context.session.setState({ extractedText });
    return context.session.sendTextMessage("The text from your document has been received, now please ask your question.");
}

/**
 * Extracts text from given images using Tesseract OCR.
 * @param {Array} imageFiles - An array of image file paths.
 * @returns {string} The extracted text.
 */
const extractTextFromImages = async (imageFiles) => {
    const textChunks = [];

    for ( const imagePath of imageFiles ) {
        // Use Tesseract to extract text from the image.
        const tesseractCommand = `tesseract "${ imagePath }" stdout --oem 1 --psm 3`;
        const extractedText = execSync(tesseractCommand).toString().trim();
        textChunks.push(extractedText);
    }

    const textString = textChunks.join('\n');
    return textString;
}

/**
 * Extracts text from a PDF file.
 * @param {string} pdfPath - The path to the PDF file.
 * @returns {string} The extracted text.
 */
const extractTextFromPDF = async (pdfPath) => {
    // Load the PDF.
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const loadingTask = pdfjsLib.getDocument(data);
    const pdfDocument = await loadingTask.promise;

    let text = '';

    // Loop through all the pages in the PDF.
    for ( let i = 1; i <= pdfDocument.numPages; i++ ) {
        const page = await pdfDocument.getPage(i);
        const content = await page.getTextContent();

        // Concatenate all text items in the page.
        const pageText = content.items.map(item => item.str).join(' ');
        text += pageText + ' ';
    }

    return text;
}

/**
 * Converts a PDF file to images using ImageMagick's convert command.
 * @param {string} pdfURL - The URL of the PDF file.
 * @param {string} outputDir - The output directory where the images should be saved.
 * @param {number} resolution - The resolution to use when converting. Default is 500.
 * @returns {Array} An array of paths to the image files.
 */
const convertPDFToImages = async (pdfURL, outputDir, resolution = 500) => {
    // Create a unique folder name.
    const uniqueFolderName = uuidv4();
    const uniqueOutputDir = `${ outputDir }/${ uniqueFolderName }`;

    // Create output directories if they don't exist.
    if ( !fs.existsSync(outputDir) ) {
        fs.mkdirSync(outputDir);
    }
    if ( !fs.existsSync(uniqueOutputDir) ) {
        fs.mkdirSync(uniqueOutputDir);
    }

    // Download the PDF file.
    const response = await axios.get(pdfURL, { responseType: 'arraybuffer' });
    const pdfBuffer = Buffer.from(response.data);

    // Save the PDF file to disk.
    const pdfFilePath = `${ outputDir }/${ uniqueFolderName }.pdf`;
    fs.writeFileSync(pdfFilePath, pdfBuffer);

    // Convert the PDF to images using ImageMagick.
    const convertCommand = `convert -density ${ resolution } "${ pdfFilePath }" "${ uniqueOutputDir }/page-%d.png"`;
    execSync(convertCommand);

    // Get the paths to the image files.
    const imageFiles = fs.readdirSync(uniqueOutputDir).map((file) => `${ uniqueOutputDir }/${ file }`);
    fs.unlinkSync(pdfFilePath);

    return imageFiles;
}

module.exports = {
    processPDF
}
