import {connectingToNewRoom, connectToRooms, getConnectData} from './config/connect.js'
import {client} from "@xmpp/client"
import debug from "@xmpp/debug"
import {router} from "./router.js";
import 'dotenv/config';
import {connectToDb} from "./database/dataBase.js";
import {welcomePresence} from "./presence.js";
import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let connectData;
//Check if all the data is filled in .env, connect to the API, get the connection data and save this data.
await getConnectData().then((result) => {
    connectData = result;
}).catch(error => {
    console.log(error);
    throw "stop";
});

const xmpp = client({
    service: connectData.botAddress, username: connectData.botName, password: connectData.botPassword,
});

debug(xmpp, false);

xmpp.on("offline", () => console.log("OFFLINE: xmpp disconnected and no automatic attempt to reconnect will happen"));

xmpp.on('error', err => console.log('ERROR:', err.toString));

xmpp.on('status', status => console.log('STATUS:', status));

xmpp.on("stanza", async stanza => {
    if (stanza.attrs.from) {
        //The address of the bot in the chat room is needed in order not to work with messages from the bot.
        const botAddressInTheRoom = stanza.attrs.from.replace(/\w+[.!?]?$/, '') + connectData.botName;
        //The address of the user in the room who wrote the message.
        const senderAddressInTheRoom = stanza.attrs.from;

        //I start further actions if I received a "message" and the sender of this message is not a bot.
        if (stanza.is("message") && senderAddressInTheRoom !== botAddressInTheRoom) {

            const body = stanza.getChild('body');
            //Form an object with data from the stanza, which is necessary for working with handlers
            let handlerData = groupDataForHandler(xmpp, stanza, connectData);

            // Processing an incoming chat room invitation
            if (body && stanza.getChild('x') && stanza.getChild('x').getChild('invite') && process.env.INVITATION === 'true' && connectData.dataBaseStatus) {
                return connectingToNewRoom(xmpp, body.parent.attrs.from, connectData);
            }

            // Send message if user presence detected
            if (stanza.attrs.id === 'isComposing' && process.env.PRESENCE === 'true') {
                return welcomePresence(handlerData);
            }

            // Processing an incoming message from a user
            if (body && stanza.getChild('data')) {
                return router(handlerData);
            }
        }
    }
});

xmpp.on('online', jid => {
    //Connecting to databases and after that chat rooms.
    if (connectData.dataBaseStatus) {
        connectToDb().then(() => {
            console.log('==> Successful database connection');
            //Connect to the default chat room and saved chat rooms.
            connectToRooms(xmpp, jid.toString(), connectData);
        }).catch(error => {
            console.log('==> Error connecting to database: ', error);
            return xmpp.stop().catch(console.error);
        });
    } else {
        console.log('=> WARNING: Can\'t connect to database (connection data is empty) | invitations won\'t work.');
        //Connect to the default chat room
        connectToRooms(xmpp, jid.toString(), connectData);
    }
});

xmpp.start().catch(console.error);

const groupDataForHandler = (xmpp, stanza, connectData) => {
    let message;
    //If there is a body in the stanza, get a message.
    if (stanza.getChild('body')) {
        message = stanza.getChild('body').getText();
    }

    return {
        xmpp,
        message,
        roomJID: stanza.attrs.from.substring(0, stanza.attrs.from.lastIndexOf('/') + 1).slice(0, -1),
        userJID: stanza.attrs.from.split("/").pop() + '@' + connectData.botAddress,
        userStep: 0,
        receiverData: stanza.getChild('data') ? stanza.getChild('data').attrs : null,
        receiverMessageId: stanza.getChild('stanza-id') ? stanza.getChild('stanza-id').attrs.id : 0,
        connectData,
        openai
    }
}