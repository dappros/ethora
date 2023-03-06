const {Bot} = require('../../lib');

const token = '' //API token
const rooms = ['']; //List of rooms in which the bot will work

const data = {
    username: 'Test',
    password: '12345678',
    tokenJWT: token,
    botName: 'Simple',
    connectionRooms: rooms
}

const bot = new Bot(data);

bot.use(async (ctx, next) => {
    //If the user has already been to this step before
    if (ctx.stepper.getCurrentStep() && ctx.stepper.getCurrentStep().editing) {
        return !ctx.message.filterText('Test') ?
            await ctx.session.sendTextMessage('Oh, I see we already know each other.\n' +
            '\n' +
            'You know what to do, just write "Test" ;)') : next();
    }

    //Sending a message when a message is received from the user
    await ctx.session.sendTextMessage('Hello!\n' +
        'This is the main introductory message.\n' +
        '\n' +
        'If you want to talk, write "Test".');

    //Run the next handler from the list
    return next();
});

//Run handler (on step 0) on keyword condition
bot.use('_key_ Test', async (ctx) => {
    await ctx.session.sendTextMessage(
        'Congratulations, you have moved to step 1, write something.');

    //User transition to the next step
    ctx.stepper.nextUserStep();
});

bot.use(async (ctx) => {
    //Filter message by keywords inside handler
    if (ctx.message.filterText('Close')) {
        //Zeroing a step for a user
        ctx.stepper.removeNextUserStep();

        //Sending a message
        return await ctx.session.sendTextMessage('Okay, back to the main menu.');
    }

    //Simple keyboard to exit
    const keyboard = [{
        name: 'Close',
        value: 'Close',
        notDisplayedValue: 'close'
    }];

    //Sending a message every time a message is received from the user. We resend his message.
    return await ctx.session.sendTextMessage(`You wrote: ${ctx.message.getText()} (to stop, type "Close")`, keyboard);
}, 1);