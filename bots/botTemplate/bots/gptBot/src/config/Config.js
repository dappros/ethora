const path = require("path")
require('dotenv').config({path: path.join(__dirname, '../../.env')})


const botInitData = () => {
    const botData = {
        email: process.env.EMAIL,
        password: process.env.PASSWORD,
        tokenJWT: process.env.TOKEN,
        botName: process.env.BOT_NAME,
        useTyping: true,
        connectionRooms: process.env.ROOMS.split(',')
    }

    const openaiData = {
        token: process.env.OPENAI_API_KEY
    }
    return {
        botData,
        openaiData
    }
}

module.exports = {
    botInitData,
};