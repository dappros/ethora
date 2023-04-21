const path = require("path")
require('dotenv').config({path: path.join(__dirname, '../../.env')})


const botInitData = () => {
    return {
        username: process.env.APP_USERNAME,
        password: process.env.PASSWORD,
        tokenJWT: process.env.TOKEN,
        botName: process.env.BOT_NAME,
        botImg: process.env.AVATAR,
        useTyping: true,
        connectionRooms: process.env.ROOMS.split(',')
    }
}

module.exports = {
    botInitData,
};