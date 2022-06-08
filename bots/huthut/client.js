import connectData from './config/connect.js'
import {client, xml} from "@xmpp/client"
import debug from "@xmpp/debug"
import {connectRoom} from './actions.js';
import messages from "./config/messages.js";
import botOptions from "./config/config.js";
import {router} from "./router.js";
import {botLogin} from "./api.js";
import 'dotenv/config';

const xmpp = client({
    service: connectData.botAddress, username: connectData.botName, password: connectData.botPassword,
});

debug(xmpp, false);

xmpp.on("offline", () => console.log("OFFLINE: xmpp disconnected and no automatic attempt to reconnect will happen"));

xmpp.on('error', err => console.log('ERROR:', err.toString));

xmpp.on('status', status => console.log('STATUS:', status));

xmpp.on("stanza", async stanza => {
        if (stanza.is('presence') && stanza.attrs.type === 'subscribe') {
            xmpp.send(xml('presence', {to: stanza.attrs.from, type: 'subscribed'}));
        }

        //Get the address of the bot in the current chat room
        let userRoomAddress;
        if (stanza.attrs.from) {
            userRoomAddress = stanza.attrs.from.replace(/\w+[.!?]?$/, '') + connectData.botName;
        }

        if (stanza.is("message") && stanza.attrs.from !== userRoomAddress) {

            let body = stanza.getChild('body');
            let data = stanza.getChild('data');
            let stanzaId = stanza.getChild('stanza-id');

            let message;

            if (body && data && stanzaId) {

                message = body.getText();

                const sender = stanza.attrs.to;
                const receiver = stanza.attrs.from;

                router(xmpp, message, sender, receiver, body.name, data, stanzaId);
            }
        }
    }
);

xmpp.on('online', jid => {
    if(!connectData){
        xmpp.stop().catch(console.error);
        return xmpp.on("offline", () => {
            console.log("offline");
        });
    }

    console.log('CONNECT TO APP: ', connectData.appUsername, connectData.appPassword);

    botLogin(connectData.appUsername, connectData.appPassword).then(() => {
        console.log('CONNECTED')
    }).catch(error => {
        console.log('botLogin Error: ', error);
        xmpp.stop().catch(console.error);
        return xmpp.on("offline", () => {
            console.log("offline");
        });
    });

    console.log('ONLINE:', jid.toString());

    xmpp.send(xml('presence', {}, xml('show', {}, 'chat'), xml('status', {}, messages.general.botStatusOnline),));

    let roomAddress;
    for (let roomData of botOptions.allowedRooms) {
        if (roomData.conferenceAddress === connectData.conferenceAddress && roomData.type === connectData.type) {
            roomAddress = roomData.name + roomData.conferenceAddress;
            connectRoom(xmpp, jid.toString(), roomAddress);
        }
    }

});

xmpp.start().catch(console.error);