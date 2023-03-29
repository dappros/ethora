import {Config} from "./config/Config";
const { Bot } = require('../../../lib');

const config = new Config();
const bot = new Bot(config.getBotInitData);

bot.use('_key_ Test', async (ctx) => {
    await ctx.session.sendTextMessage('Hi, this is test message');
});