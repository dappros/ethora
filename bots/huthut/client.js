import connectData from './config/connect.js'
import {client, xml} from "@xmpp/client"
import debug from "@xmpp/debug"
import {sendMessage, connectRoom, messageCheck} from './actions.js';
import messages from "./config/messages.js";
import botOptions from "./config/config.js";

const xmpp = client({
    service: connectData.botAddress, username: connectData.botName, password: connectData.botPassword,
});

debug(xmpp, false);

xmpp.on("offline", () => console.log("OFFLINE: xmpp disconnected and no automatic attempt to reconnect will happen"));

xmpp.on('error', err => console.log('ERROR:', err.toString));

xmpp.on('status', status => console.log('STATUS:', status));

// xmpp.on('input', input => console.log('INPUT:', input));
//
// xmpp.on('output', output => console.log('OUTPUT:', output));

xmpp.on("stanza", async stanza => {
        if (stanza.is('presence') && stanza.attrs.type === 'subscribe') {
            xmpp.send(xml('presence', {to: stanza.attrs.from, type: 'subscribed'}));
        }

        if (stanza.is("message") && stanza.attrs.from !== xmpp.jid) {
            stanza.children.forEach(child => {

                    const address = stanza.attrs.to;
                    const jid = stanza.attrs.from;
                    const msg = child.children.join('\n');

                    if (child.name === 'x' && msg.match(/\binvite\S*\b/g)) {
                        console.log('=> The bot was invited to the chat room ', jid);
                        connectRoom(xmpp, address, jid);
                    }

                    if (child.name === 'body') {
                        console.log('=> Message received from ', jid, msg)
                        if (messageCheck(msg, 'hut test')) {
                            sendMessage(xmpp, jid, 'message', messages.testMessage)
                        }

                        if (messageCheck(msg, 'hut back turn forest')) {
                            sendMessage(xmpp, jid, 'message', messages.visiteingHut.firstGreeting)
                        }

                        if (messageCheck(msg, 'hut front turn me')) {
                            sendMessage(xmpp, jid, 'message', messages.visiteingHut.openingHut)
                        }

                    }
                }
            )
        }
    }
);

xmpp.on('online', jid => {
    console.log('ONLINE:', jid.toString());

    xmpp.send(xml('presence', {}, xml('show', {}, 'chat'), xml('status', {}, messages.general.botStatusOnline),));

    let roomAddress;
    for (let roomData of botOptions.allowedRooms) {
        if (roomData.conferenceAddress === connectData.conferenceAddress) {
            roomAddress = roomData.name + roomData.conferenceAddress;
            connectRoom(xmpp, jid.toString(), roomAddress);
        }
    }

});

xmpp.start().catch(console.error);