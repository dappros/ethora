import {botLogin, loginData} from "../api.js";

export const getConnectData = async () => {
    console.log('=> Running a bot on a ' + process.env.TYPE + ' server');

    if (
        !process.env.TYPE ||
        !process.env.BOT_ADDRESS ||
        !process.env.CONFERENCE_ADDRESS ||
        !process.env.APP_USERNAME ||
        !process.env.APP_PASSWORD
    ) {
        return Error('Not all data for launching the bot is specified')
    }

    if (
        !process.env.MONGO_USERNAME &&
        !process.env.MONGO_PASSWORD &&
        !process.env.MONGO_HOSTNAME &&
        !process.env.MONGO_PORT &&
        !process.env.MONGO_DB
    ) {
        return Error('Not all data for connecting to the database are specified');
    }

    if (!loginData.success) {
        await botLogin(process.env.APP_USERNAME, process.env.APP_PASSWORD).then(() => {
            console.log('CONNECTED TO API')
        }).catch(error => {
            console.log('botLogin Error: ', error);
            return Error('botLogin Error');
        });
    }

    return {
        botName: getBotName(loginData.user.defaultWallet.walletAddress),
        botAddress: process.env.BOT_ADDRESS,
        botPassword: loginData.user.xmppPassword,
        conferenceAddress: process.env.CONFERENCE_ADDRESS,
        appUsername: process.env.APP_USERNAME,
        appPassword: process.env.APP_PASSWORD,
        walletAddress: loginData.user.defaultWallet.walletAddress,
        type: process.env.TYPE
    };
}

const getBotName = (str) => {
    try {
        return str.replace(/([A-Z])/g, '_$1').toLowerCase();
    } catch (error) {
        console.log('getBotName error: ', error);
    }
}