import {connectingToNewRoom, connectToRooms, getConnectData} from './config/connect.js'
import {client, xml} from "@xmpp/client"
import debug from "@xmpp/debug"
import messages from "./config/messages.js";
import {router} from "./router.js";
import 'dotenv/config';
import {connectToDb} from "./dataBase.js";
import {welcomePresence} from "./presence.js";

let connectData;

if (!connectData) {
    await getConnectData().then((result) => {
        connectData = result;
    }).catch(error => {
        console.log(error);
        throw "stop";
    });
}

const xmpp = client({
    service: connectData.botAddress, username: connectData.botName, password: connectData.botPassword,
});

debug(xmpp, false);

xmpp.on("offline", () => console.log("OFFLINE: xmpp disconnected and no automatic attempt to reconnect will happen"));

xmpp.on('error', err => console.log('ERROR:', err.toString));

xmpp.on('status', status => console.log('STATUS:', status));

xmpp.on("stanza", async stanza => {
        if (stanza.attrs.from) {
            const userRoomAddress = stanza.attrs.from.replace(/\w+[.!?]?$/, '') + connectData.botName;

            if (stanza.is('presence') && stanza.attrs.type === 'subscribe') {
                xmpp.send(xml('presence', {to: stanza.attrs.from, type: 'subscribed'}));
            }

            if (stanza.is("message") && stanza.attrs.from !== userRoomAddress) {

                const body = stanza.getChild('body');
                const roomJID = stanza.attrs.from.substring(0, stanza.attrs.from.lastIndexOf('/') + 1).slice(0, -1);
                const userJID = stanza.attrs.from.split("/").pop() + '@' + process.env.BOT_ADDRESS;
                const receiverData = stanza.getChild('data');
                const receiverMessageId = stanza.getChild('stanza-id') ? stanza.getChild('stanza-id').attrs.id : 0;


                if(receiverData && receiverData.attrs.botType === 'mintBot'){
                    console.log('Start mintBot ======= =======>', receiverData.attrs);
                    return router(xmpp, null, roomJID, userJID, receiverData, receiverMessageId, connectData);
                }

                // Processing an incoming chat room invitation
                if(body && stanza.getChild('x') && stanza.getChild('x').getChild('invite') && process.env.INVATION === 'true'){
                    return connectingToNewRoom(xmpp, body.parent.attrs.from, connectData);
                }

                // Displaying the isComposing status in the chat before the bot sends a message
                if (stanza.attrs.id === 'isComposing' && process.env.PRESENCE === 'true') {
                    welcomePresence(xmpp, roomJID, userJID, receiverData, receiverMessageId, connectData);
                }

                // Processing an incoming message from a user
                if (body && receiverData) {
                    const message = body.getText();
                    return router(xmpp, message, roomJID, userJID, receiverData, receiverMessageId, connectData);
                }
            }
        }
    }
);

xmpp.on('online', jid => {
    connectToDb().then(() => {
        console.log('==> Successful database connection');
        connectToRooms(xmpp, jid.toString(), connectData);
    }).catch(error => {
        console.log('==> Error connecting to database: ', error);
        return xmpp.stop().catch(console.error);
    });

    xmpp.send(xml('presence', {}, xml('show', {}, 'chat'), xml('status', {}, messages.general.botStatusOnline),));
});

xmpp.start().catch(console.error);