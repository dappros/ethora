import {xml} from "@xmpp/client";
import connectData from "./config/connect.js";
import messages from "./config/messages.js";

const sendMessage = (xmpp, jid, type, message) => {
    xmpp.send(xml('message', {
        to: jid,
        type: type
    }, xml('body', {}, message)));
}

const connectRoom = (xmpp, address) => {
    let roomAddress = 'hliuch' + connectData.conferenceAddress;
    let myRoomAddress = 'hliuch' + connectData.conferenceAddress + '/' + connectData.botName;

    console.log('=> Connecting to the room: ', roomAddress);

    xmpp.send(xml('presence', {
        from: address,
        to: myRoomAddress,
    }, xml('x', 'http://jabber.org/protocol/muc', xml('history', {maxstanzas: 0})))).catch(console.error);

    console.log('=> Sending a welcome message: ', roomAddress);

    sendMessage(xmpp, roomAddress, 'groupchat', messages.hello)
}

export { sendMessage, connectRoom };