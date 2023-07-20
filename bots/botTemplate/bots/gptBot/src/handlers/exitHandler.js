/**
 * A middleware function that is called when the user wants to manually terminate all processes.
 * It effectively clears the current bot state.
 *
 * @param {Object} context - The context object encapsulating user, message, and session data provided by the Bot platform.
 * @returns {Promise} - A Promise that resolves to sending a confirmation text message to the user.
 */
const clearBotState = async (context) => {
    // Clearing the state of the session by setting the relevant variables to empty strings.
    // This effectively "forgets" the data that was previously stored.
    context.session.setState({ extractedText: "", fileUrl: "" });

    // Removing the next step in the process, effectively halting any further actions
    // that the bot was previously programmed to perform.
    context.stepper.removeNextUserStep();

    // Sending a confirmation message to the user, notifying them that the bot has successfully cleared its state.
    return context.session.sendTextMessage("I forgot about your file, thanks for your work!");
}

module.exports = clearBotState;
