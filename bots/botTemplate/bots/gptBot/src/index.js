const { Bot } = require('../../../lib');
const { botInitData } = require("./config/Config");
const { runCompletion } = require("./utils/Openai");

const bot = new Bot(botInitData().botData);

bot.use("Start", async (context) => {

    await context.session.sendTextMessage("Hello!\n" +
        "Send me all your questions and I'll try to answer them.");

    // Move to the next step
    context.stepper.nextUserStep();
});

bot.use(async (context) => {

    const indexOfSpace = context.message.getText().indexOf(' ');
    let clearMessage = context.message.getText().slice(indexOfSpace + 1);
    if (!clearMessage.endsWith('.')) {
        clearMessage += '.'
    }

    runCompletion(clearMessage).then(result => {
        return context.session.sendTextMessage(result);
    }).catch(error => {
        console.log("Error: ", error)
    })

}, 1);