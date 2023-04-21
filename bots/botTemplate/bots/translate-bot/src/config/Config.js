const path = require("path")
require('dotenv').config({path: path.join(__dirname, '../../.env')})


const botInitData = () => {
    const botData = {
        username: process.env.APP_USERNAME,
        password: process.env.PASSWORD,
        tokenJWT: process.env.TOKEN,
        botName: process.env.BOT_NAME,
        useTyping: true,
        connectionRooms: process.env.ROOMS.split(',')
    }

    const googleData = {
        token: process.env.GOOGLE_TOKEN
    }
    return {
        botData,
        googleData
    }
}

module.exports = {
    botInitData,
};