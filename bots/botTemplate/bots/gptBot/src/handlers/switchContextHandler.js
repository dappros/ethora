/**
 * Allergy context switch handler.
 *
 * @param {Object} context - The context object provided by the Bot
 */
const switchToAllergyContext = async (context) => {
    await context.session.sendTextMessage('Context mode is on, ask questions about your allergies.');
    //User transition to the next step
    context.stepper.nextUserStep();
}

module.exports = {
    switchToAllergyContext
};
