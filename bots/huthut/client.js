import connectData from './config/connect.js'
import {client, xml} from "@xmpp/client"
import debug from "@xmpp/debug"
import {sendMessage, connectRoom} from './actions.js';
import messages from "./config/messages.js";

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

                    const jid = stanza.attrs.from;
                    const msg = child.children.join('\n');

                    if (child.name === 'x' && msg.match(/\binvite\S*\b/g)) {
                        console.log('=> The bot was invited to the chat room ', jid);
                        connectRoom(xmpp, jid);
                    }

                    if (child.name === 'body') {
                        console.log('=> Message received from ', jid, msg)
                        if (msg === 'test') {
                            sendMessage(xmpp, jid, 'message', messages.testMessage)
                        }

                        if (msg === 'Turn your back to the forest, hut, hut.') {
                            sendMessage(xmpp, jid, 'message', messages.visiteingHut.firstGreeting)
                        }

                        if (msg === 'Turn your front to me, hut, hut.') {
                            sendMessage(xmpp, jid, 'message', messages.visiteingHut.openingHut)
                        }

                    }
                }
            )
        }
    }
)
;

xmpp.on('online', jid => {
    console.log('ONLINE:', jid.toString());

    xmpp.send(xml('presence', {}, xml('show', {}, 'chat'), xml('status', {}, messages.general.botStatusOnline),));

    connectRoom(xmpp, jid.toString());
});

xmpp.start().catch(console.error);