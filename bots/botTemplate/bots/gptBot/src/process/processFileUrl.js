const axios = require('axios');

/**
 * Function to process a file URL and fetch data from it.
 *
 * @param {Object} context - The context object provided by the Bot
 * @param {String} fileUrl - The URL of the file to be processed
 */
const processFileUrl = async (context, fileUrl) => {
    // Check if fileUrl exists in the context's state
    if ( fileUrl ) {
        const question = context.message.getText();

        // Inform the user about data processing
        await context.session.sendTextMessage('Please wait while I process your data...');

        try {
            // Get the base server URL from environment variables
            const baseUrl = process.env.CUSTOM_API;

            // Send the file URL and question to the server for processing
            const response = await axios.post(`${ baseUrl }/query`, {
                file_url: fileUrl,
                question
            });

            // If response is not OK, throw an error
            if ( response.status !== 200 ) {
                await context.session.sendTextMessage('An error occurred while processing your file.');
                throw new Error(`HTTP error! status: ${ response.status }`);
            }

            // If response is OK, extract the JSON data and send it back to the user
            const data = response.data;
            return context.session.sendTextMessage(String(data).trim());
        } catch ( error ) {
            console.log("Error while processing file URL: ", error);
        }
    } else {
        console.log("No fileUrl available in the context's state.");
    }
}

module.exports = {
    processFileUrl
};
