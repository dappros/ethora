import connectData from './config/connect.js'
import {client, xml} from "@xmpp/client"
import debug from "@xmpp/debug"

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
                        connectRoom(jid);
                    }

                    if (child.name === 'body') {
                        console.log('=> Message received from ', jid, msg)
                        if (msg === 'test') {
                            xmpp.send(xml('message', {to: jid, type: 'chat'}, xml('body', {}, 'Test response')));
                        }

                        if (msg === 'Turn your back to the forest, hut, hut.') {
                            xmpp.send(xml('message', {
                                to: jid,
                                type: 'chat'
                            }, xml('body', {}, 'Screeches and creaks are heard from the woods as you approach what looks like a hut on chicken legs. The hut seems to be on alert waiting for what you have to say.')));
                        }

                        if (msg === 'Turn your front to me, hut, hut.') {
                            xmpp.send(xml('message', {
                                to: jid,
                                type: 'chat'
                            }, xml('body', {}, 'Further blood-curdling screeches and creaks are heard as the hideous Hut spins around. It finally comes to a stop with its door towards you. Will you dare entering?')));
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

    xmpp.send(xml('presence', {}, xml('show', {}, 'chat'), xml('status', {}, 'Bot Online'),));

    connectRoom(jid.toString());
});

const connectRoom = (address) => {
    let roomAddress = 'hliuch' + connectData.conferenceAddress;
    let myRoomAddress = 'hliuch' + connectData.conferenceAddress + '/' + connectData.botName;

    console.log('=> Connecting to the room: ', roomAddress);

    xmpp.send(xml('presence', {
        from: address, to: myRoomAddress,
    }, xml('x', 'http://jabber.org/protocol/muc'))).catch(console.error);

    console.log('=> Sending a welcome message: ', roomAddress);

    xmpp.send(xml('message', {to: roomAddress, type: 'groupchat'}, xml('body', {}, 'Hey! Hut Hut Bot launched')));

}

xmpp.start().catch(console.error);