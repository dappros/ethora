import {Config} from "./config/Config";
import {onEnd, questions} from "./data/Questions";

const {Bot} = require('../../../lib');

const config = new Config();
const bot = new Bot(config.getBotInitData);
//Variable to store and iterate over the current question index
let questionIndex = 0;

bot.use("Create", async (ctx) => {
    // Initialize state properties
    questionIndex = 0;
    ctx.session.setState({
        answers: {},
        coinsLeft: 0
    });

    // Send initial message to user
    const message = questions[questionIndex].message(ctx.message.data.user).messages;
    await ctx.session.sendTextMessage(message);

    // Move to the next step
    ctx.stepper.nextUserStep();
});


bot.use(async (ctx) => {
    const messageData = ctx.message.data;
    let question = questions[questionIndex];

    const stopStatus = await stopCheck(ctx);

    if (stopStatus) {
        return;
    }

    const validation = question.validateAnswer(ctx.session, messageData, questionIndex);

    if (validation.status) {
        question.handler(ctx.session, messageData, questionIndex);
        questionIndex = getNextQuestionIndex(questionIndex, messageData, ctx.session.state.answers);
        const {messages, keyboard} = questions[questionIndex].message(messageData.user, ctx.session.state.answers);
        await ctx.session.sendTextMessage(messages, keyboard);
    } else {
        const {messages, keyboard} = validation;
        await ctx.session.sendTextMessage(messages, keyboard);
    }
}, 1);

bot.use("coinReceived", async (ctx) => {
    const messageData = ctx.message.data;

    if (questionIndex + 1 >= questions.length) {
        const validation = questions[questionIndex].validateAnswer(ctx.session, messageData, questionIndex);

        if (validation.status) {
            return await onEnd(ctx);
        } else {
            return await ctx.session.sendTextMessage(validation.messages);
        }
    } else {
        return await ctx.session.sendTextMessage(`Thanks for the ${ctx.message.data.messageData.tokenAmount} coins!`);
    }
});

const getNextQuestionIndex = (currentIndex, messageData, answers) => {
    let index = currentIndex + 1;

    //skip the question if there is none
    if (!questions[index].message(messageData.user, answers)) {
        index += 1;
    }

    return index;
};

const stopCheck = async (ctx: any): Promise<boolean> => {
    const messageData = ctx.message.data;
    const {notDisplayedValue} = ctx.message.data.messageData;

    if (notDisplayedValue === "continue") {
        return true;
    }

    if (notDisplayedValue === "stop") {
        const sum = 3 - ctx.session.state.coinsLeft;

        if (ctx.session.state.coinsLeft > 0 && sum > 0) {
            ctx.session.sendCoinsToUser(sum);
        }

        ctx.stepper.removeNextUserStep();
        ctx.session.setState({
            answers: {},
            coinsLeft: 0,
        });

        return true;
    }

    if (ctx.message.filterText("exit") || ctx.message.filterText("stop")) {
        const messages = [`${messageData.user.firstName} ${messageData.user.lastName}, Would you like to stop the process?`];
        const keyboard = [
            {name: "Yes, stop 🚫", value: "Yes, stop 🚫", notDisplayedValue: "stop"},
            {name: "No, keep going ▶️", value: "No, keep going ▶️", notDisplayedValue: "continue"},
        ];

        await ctx.session.sendTextMessage(messages, keyboard);
        return true;
    }

    return false;
};