import {xml} from "@xmpp/client";
import connectData from "./config/connect.js";
import messages from "./config/messages.js";
import botOptions from "./config/config.js";

let userStepsList = [];

// Sending a message in person or in a chat room.
// For a private send, the "type" attribute must change to "message". To send to the chat room "groupchat"
const sendMessage = (xmpp, receiverAddress, type, message, receiverData, isSystemMessage, tokenAmount, stanzaId) => {
    xmpp.send(xml('message', {
        to: stanzaId ? stanzaId.attrs.by : receiverAddress,
        type: receiverData ? 'groupchat' : type,
        id: "sendMessage"
    }, xml('data', {
        xmlns: "http://" + connectData.botAddress,
        senderFirstName: botOptions.botData.firstName,
        senderLastName: botOptions.botData.lastName,
        photoURL: botOptions.botData.photoURL,
        senderJID: connectData.botName+'@'+connectData.botAddress,
        senderWalletAddress: botOptions.botData.senderWalletAddress,
        isSystemMessage: isSystemMessage,
        tokenAmount: tokenAmount,
        receiverMessageId: stanzaId ? stanzaId.attrs.id : 0,
        roomJid: receiverData ? receiverData.attrs.roomJid : '',
    }), xml('body', {}, receiverData ? isSystemMessage ? message : receiverData.attrs.senderFirstName + ': ' + message : message)));
}

const connectRoom = (xmpp, address, roomAddress) => {
    let myRoomAddress = roomAddress + '/' + connectData.botName;

    console.log('=> Connecting to the room: ', roomAddress);

    xmpp.send(xml('presence', {
        from: address,
        to: myRoomAddress,
    }, xml('x', 'http://jabber.org/protocol/muc', xml('history', {maxstanzas: 0})))).catch(console.error);

    console.log('=> Sending a welcome message: ', roomAddress);

    sendMessage(
        xmpp,
        roomAddress,
        'groupchat',
        messages.general.welcomeMessage,
        null,
        false,
        0,
        null
    );
}

const buildRegEx = (str, keywords) => {
    return new RegExp("(?=.*?\\b" +
        keywords
            .split(" ")
            .join(")(?=.*?\\b") +
        ").*",
        "i"
    );
}

const messageCheck = (str, keywords) => {
    return buildRegEx(str, keywords).test(str) === true
}

const userSteps = (type, jid, newStep) => {
    // console.log('=>=> Run user steps, find user. Type: ', type, ' user jid: ', jid);
    let userIndex = userStepsList.findIndex(user => user.name === jid);

    if (userIndex < 0) {
        // console.log('=>=> Create user step', jid);
        userStepsList.push({name: jid, step: 1});
        return 1;
    }

    if (type === 'getStep') {
        return userStepsList[userIndex].step;
    }

    if (type === 'setStep') {
        // console.log('=>=> Set new step for user ', jid)
        userStepsList[userIndex].step = newStep;
        return true;
    }

    console.log('=>=> Something wrong ', type, jid, newStep)
    return false;
}

export {sendMessage, connectRoom, messageCheck, userSteps};