const axios = require('axios');
const { execSync } = require('child_process');

/**
 * Function to process an image and extract data from it.
 *
 * @param {Object} context - The context object provided by the Bot
 * @param {String} imageLocation - The location of the image to be processed
 */
const processImage = async (context, imageLocation) => {
    if ( imageLocation ) {
        // Inform the user about data processing
        await context.session.sendTextMessage('Processing your image, please wait a few seconds...');

        try {
            // Get the image buffer
            const response = await axios.get(imageLocation, {
                responseType: 'arraybuffer'
            });

            // Convert the binary data into a Buffer
            const imageBuffer = Buffer.from(response.data, 'binary');

            // Extracting text from an image
            const extractedText = recognizeText(imageBuffer);
            context.session.setState({ extractedText });

            return context.session.sendTextMessage("The text from your image has been received, now please ask your question.");

        } catch ( error ) {
            console.error('Image processing error:', error);
            throw error;
        }
    } else {
        console.log("No imageLocation available in the context's state.");
    }
}

const recognizeText = async (imageBuffer) => {
    // Text recognition with Tesseract
    const tesseractCommand = `tesseract stdin stdout --oem 1 --psm 3`;
    return execSync(tesseractCommand, { input: imageBuffer }).toString().trim();
}

module.exports = {
    processImage
};
