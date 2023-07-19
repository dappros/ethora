/**
 * Function to process an image and extract data from it.
 *
 * @param {Object} context - The context object provided by the Bot
 * @param {String} fileUrl - The location of the CSV file to be processed
 */
const processCSV = async (context, fileUrl) => {
    if ( fileUrl ) {
        // Only the path to the file is immediately saved, further processing will occur with each user question
        context.session.setState({ fileUrl });
        return context.session.sendTextMessage("The text from your document has been received, now please ask your question.");
    } else {
        console.log("No imageLocation available in the context's state.");
    }
}

module.exports = {
    processCSV
};
