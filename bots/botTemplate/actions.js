import {xml} from "@xmpp/client";
import messages from "./config/messages.js";
import botOptions from "./config/config.js";

let userStepsList = [];
let userDatalist = [];
// Sending a message in person or in a chat room.
// For a private send, the "type" attribute must change to "message". To send to the chat room "groupchat"
const sendMessage = (data, message, type, isSystemMessage, tokenAmount, buttons) => {
    if (isSystemMessage) {
        xmppSender(data, message, type, isSystemMessage, tokenAmount, buttons)
    } else {
        sendTyping(data.xmpp, data.connectData, data.roomJID, 'isComposing')
        setTimeout(() => xmppSender(data, message, type, isSystemMessage, tokenAmount, buttons), getWritingTime(message))
    }
}

const xmppSender = (data, message, type, isSystemMessage, tokenAmount, buttons) => {
    data.xmpp.send(xml('message', {
        to: data.roomJID,
        type: data.receiverData ? 'groupchat' : type,
        id: "sendMessage"
    }, xml('data', {
        xmlns: "http://" + data.connectData.botAddress,
        senderFirstName: botOptions.botData.firstName,
        senderLastName: botOptions.botData.lastName,
        photoURL: botOptions.botData.photoURL,
        senderJID: data.connectData.botName + '@' + data.connectData.botAddress,
        senderWalletAddress: data.connectData.walletAddress,
        isSystemMessage: isSystemMessage,
        tokenAmount: tokenAmount,
        receiverMessageId: data.receiverMessageId,
        roomJid: data.receiverData ? data.receiverData.attrs.roomJid : '',
        quickReplies: buttons ? JSON.stringify(buttons) : [],
    }), xml('body', {}, generateMessage(data, message, isSystemMessage))));
    sendTyping(data.xmpp, data.connectData, data.roomJID, 'pausedComposing')
}

export const sendTyping = (xmpp, connectData, chat_jid, type) => {
    xmpp.send(xml('message', {
        to: chat_jid,
        type: 'groupchat',
        id: type
    }, xml('composing', {
        xmlns: 'http://jabber.org/protocol/chatstates',
    }), xml('data', {
        xmlns: "http://" + connectData.botAddress,
        fullName: botOptions.botData.firstName,
        senderWalletAddress: connectData.walletAddress
    })));
}

const generateMessage = (data, message, isSystemMessage) => {
    let userName;
    let finalMessage;

    //Getting username
    if (data.receiverData) {
        if (data.receiverData.attrs.senderFirstName) {
            userName = data.receiverData.attrs.senderFirstName;
        } else {
            userName = data.receiverData.attrs.fullName;
        }
    }

    //Collecting a message
    if (isSystemMessage) {
        finalMessage = message;
    } else {
        if (userName) {
            finalMessage = userName + ': ' + message
        } else {
            finalMessage = message;
        }
    }

    return finalMessage;
}

const getWritingTime = (message) => {
    if (message.length <= 120) {
        return 2000
    }
    if (message.length <= 250 && message.length > 120) {
        return 3500
    }
    if (message.length <= 400 && message.length > 250) {
        return 5000
    }
    if (message.length > 500) {
        return 6000
    }
}

const connectRoom = (xmpp, address, roomJID, connectData, welcomeMessage) => {
    let myRoomAddress = roomJID + '/' + connectData.botName;

    console.log('=> Connecting to the room: ', roomJID);

    xmpp.send(xml('presence', {
        from: address,
        to: myRoomAddress,
    }, xml('x', 'http://jabber.org/protocol/muc', xml('history', {maxstanzas: 0})))).catch(console.error);

    if (welcomeMessage) {
        console.log('=> Sending a welcome message: ', roomJID, '    ', myRoomAddress);
        let receiverMessageId = '';
        sendMessage(
            {xmpp, roomJID, connectData, receiverMessageId},
            messages.general.welcomeMessage,
            'groupchat',
            false,
            0,
        );
    }

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

export const getBotRoomsStanza = (xmpp, connectData) => {
    xmpp.send(xml('iq', {
            type: 'get',
            from: connectData.botName + '@' + connectData.botAddress,
            id: 'getUserRooms',
        },
        xml('query', {xmlns: 'ns:getrooms'}),
    ));

    console.log('GETBOTROOMS RESULT ==> ', test)
}

const userSteps = (type, jid, newStep) => {
    console.log('=>=> Run user steps, find user. Type: ', type, ' user jid: ', jid, newStep);
    let userIndex = userStepsList.findIndex(user => user.name === jid);

    if (userIndex < 0) {
        console.log('=>=> Create user step ' + newStep + ' ' + jid);
        userStepsList.push({name: jid, step: 1});
        return 1;
    }

    if (type === 'getStep') {
        return userStepsList[userIndex].step;
    }

    if (type === 'setStep') {
        console.log('=>=> Set new step for user ' + newStep + ' ' + jid)
        userStepsList[userIndex].step = newStep;
        return true;
    }

    console.log('=>=> Something wrong ', type, jid, newStep)
    return false;
}

export const userData = (type, jid, data, dataGroup) => {
    let userIndex = userDatalist.findIndex(user => user.name === jid);

    if (userIndex < 0) {
        console.log('=>=> Create user data', jid);
        userDatalist.push({name: jid, itemsCounter: 0});
        return true;
    }

    if (type === 'getData') {
        if (dataGroup === 'data') {
            return userDatalist[userIndex].data;
        }
        if (dataGroup === 'buttonType') {
            return userDatalist[userIndex].buttonType;
        }
        if (dataGroup === 'itemsCounter') {
            return userDatalist[userIndex].itemsCounter;
        }
        if (dataGroup === 'deleteItem') {
            return userDatalist[userIndex].deleteItem;
        }
        if (dataGroup === 'currentItemGroup') {
            return userDatalist[userIndex].currentItemGroup;
        }
        if (dataGroup === 'otherData') {
            return userDatalist[userIndex].otherData;
        }
        if (dataGroup === 'itemData') {
            return userDatalist[userIndex].itemData;
        }
        if (dataGroup === 'itemDataIndex') {
            return userDatalist[userIndex].itemDataIndex;
        }
        if (dataGroup === 'sendCoins') {
            return userDatalist[userIndex].sendCoins;
        }
        return userDatalist[userIndex].data;
    }

    if (type === 'setData') {
        console.log('=>=> Set new data for user ', jid)
        if (dataGroup === 'data') {
            userDatalist[userIndex].data = data;
        } else if (dataGroup === 'buttonType') {
            userDatalist[userIndex].buttonType = data;
        } else if (dataGroup === 'itemsCounter') {
            userDatalist[userIndex].itemsCounter = data;
        } else if (dataGroup === 'deleteItem') {
            userDatalist[userIndex].deleteItem = data;
        } else if (dataGroup === 'currentItemGroup') {
            userDatalist[userIndex].currentItemGroup = data;
        } else if (dataGroup === 'otherData') {
            userDatalist[userIndex].otherData = data;
        } else if (dataGroup === 'itemData') {
            userDatalist[userIndex].itemData = data;
        } else if (dataGroup === 'itemDataIndex') {
            userDatalist[userIndex].itemDataIndex = data;
        } else if (dataGroup === 'sendCoins') {
            userDatalist[userIndex].sendCoins = data;
        } else {
            userDatalist[userIndex].data = data;
        }
        return data;
    }

    console.log('=>=> Something wrong ', type, jid, data)
    return false;
}


export {sendMessage, connectRoom, messageCheck, userSteps};