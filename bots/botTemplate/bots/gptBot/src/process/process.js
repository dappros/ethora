const { runCompletion } = require("../utils/Openai");

/**
 * Function that processes existing extracted text and runs OpenAI completion.
 *
 * @param {Object} context - The context object provided by the Bot
 * @param {String} userJID - The user's JID (Jabber Identifier)
 */
const processExistingExtractedText = async (context, userJID) => {
    // Check if extracted text exists in the context's state
    if ( context.session.state.extractedText ) {
        // Prepare the prompt for OpenAI
        const prompt = createPrompt(context, context.session.state.extractedText);

        // Run OpenAI completion
        try {
            const result = await runCompletion(prompt, userJID);
            return context.session.sendTextMessage(result);
        } catch ( error ) {
            console.log("Error while running OpenAI completion: ", error);
        }
    } else {
        console.log("No extracted text available in the context's state.");
    }
}

/**
 * Helper function to create a prompt for OpenAI
 *
 * @param {Object} context - The context object provided by the Bot
 * @param {String} processedText - The processed/extracted text
 * @return {String} - The constructed prompt
 */
function createPrompt(context, processedText) {
    const userJID = context.message.data.user.userJID;
    return `User with id "${ userJID }", name "${ context.message.data.user.firstName }" has a question "${ context.message.getText() }", read this extracted text and answer the user's question: "${ processedText }"`;
}

module.exports = {
    processExistingExtractedText
};
