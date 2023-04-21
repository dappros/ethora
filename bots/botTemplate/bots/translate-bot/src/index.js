const { Bot } = require('../../../lib');
const { botInitData } = require("./config/Config");
const { translateText } = require("./data/API.JS");

const bot = new Bot(botInitData().botData);

bot.use( async (context) => {
    if(
        context.message.filterText("start translate") ||
        context.message.filterText("start babelfish")
    ){
        await context.session.sendTextMessage("OK, I start translating");
        return context.stepper.nextUserStep();
    }
});

bot.use(async (context) => {

    if(
        context.message.filterText("stop translate") ||
        context.message.filterText("stop babelfish")
    ){
        context.stepper.removeNextUserStep();
        return context.session.sendTextMessage('OK, I will stop translating now.\\nPlease write "start translate" or "start babelfish" for me to resume');
    }

    translateText(context.message.getText()).then(result => {
        return context.session.sendTextMessage(result);
    }).catch(error => {
        console.log("Error: ", error)
    })


}, 1);