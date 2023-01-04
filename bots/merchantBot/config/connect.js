import {botLogin, loginData} from "../api.js";
import {getListRooms, getOneRoom, saveRoomData} from "../controllers/rooms.js";
import {connectRoom} from "../actions.js";
import messages from "./messages.js";

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
        console.log('=> No user data, start authorization')
        await botLogin(process.env.APP_USERNAME, process.env.APP_PASSWORD).then(() => {
            console.log('=> Connected to API', process.env.APP_USERNAME, process.env.APP_PASSWORD)
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

export const connectingToNewRoom = (xmpp, roomJID, connectData) => {
    console.log('=> Received an invitation to join the chat room', roomJID)
    getOneRoom(roomJID).then(result => {
        if (!result) {
            saveRoomData(roomJID).then(() => {
                console.log('=> Starting a connection to a chat room', roomJID)
                return connectRoom(
                    xmpp,
                    getBotName(connectData.botName + '@' + connectData.botAddress),
                    roomJID,
                    connectData,
                    false
                );
            }).catch(error => {
                console.log('saveRoomData Error: ', error)
            })
        } else {
            console.log('=> This room has already been added to the list.', roomJID)
        }
    }).catch(error => {
        console.log('getOneRoom Error: ', error)
    })
}

export const connectToRooms = (xmpp, jid, connectData) => {
    if (process.env.DEFAULT_ROOM) {
        let statusSendWelcomeMessage = false;
        if (messages.general.welcomeMessage) {
            statusSendWelcomeMessage = true;
        }

        console.log('=> Connecting to the default room');
        connectRoom(xmpp, jid, process.env.DEFAULT_ROOM, connectData, statusSendWelcomeMessage);

    } else {
        console.log('=> Default room not found');
    }

    // I get a list of rooms from the database and connect
    getListRooms().then(rooms => {
        for (let room of rooms) {
            connectRoom(xmpp, jid.toString(), room.address, connectData, false);
        }
    }).catch(error => {
        console.log('getListRooms Error: ', error)
    })
}