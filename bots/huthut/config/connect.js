const connectData = () => {
    console.log('=> Running a bot on a ' + process.env.TYPE + ' server')
    let data = {
        botName: process.env.BOT_NAME,
        botAddress: process.env.BOT_ADDRESS,
        botPassword: process.env.BOT_PASSWORD,
        conferenceAddress: process.env.CONFERENCE_ADDRESS,
        appUsername: process.env.APP_USERNAME,
        appPassword: process.env.APP_PASSWORD,
        walletAddress: process.env.WALLET_ADDRESS,
        type: process.env.TYPE
    }
    if (
        data.botName &&
        data.botAddress &&
        data.botPassword &&
        data.conferenceAddress &&
        data.appUsername &&
        data.appPassword &&
        data.type &&
        data.walletAddress
    ) {
        return data;
    } else {
        console.log('=> Error: Not all data is specified in the configuration file, stop the startup process')
        return false;
    }
}
export default connectData();