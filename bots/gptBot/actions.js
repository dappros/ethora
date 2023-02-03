import {xml} from "@xmpp/client";
import messages from "./config/messages.js";
import botOptions from "./config/config.js";

let userStepsList = [];
// Sending a message in person or in a chat room.
// For a private send, the "type" attribute must change to "message". To send to the chat room "groupchat"
const sendMessage = (data, message, type, isSystemMessage, tokenAmount, buttons) => {
    //Send Typing if it's not a system message
    if (isSystemMessage) {
        xmppSender(data, message, type, isSystemMessage, tokenAmount, buttons)
    } else {
        sendTyping(data.xmpp, data.connectData, data.roomJID, 'isComposing');
        //Set a timeout depending on the number of characters in the message.
        setTimeout(() => xmppSender(data, message, type, isSystemMessage, tokenAmount, buttons), getWritingTime(message));

    }
}

const xmppSender = (data, message, type, isSystemMessage, tokenAmount, buttons) => {
    sendTyping(data.xmpp, data.connectData, data.roomJID, 'pausedComposing').then(() => {
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
            roomJid: data.receiverData ? data.receiverData.roomJid : '',
            quickReplies: buttons ? JSON.stringify(buttons) : [],
        }), xml('body', {}, generateMessage(data, message, isSystemMessage))));
    })
}

//Show or hide the notification that the bot is currently typing a message.
// * types:
// - isComposing : Bot is typing a message
// - pausedComposing : Bot stopped typing a message
export const sendTyping = (xmpp, connectData, chat_jid, type) => {
    return xmpp.send(xml('message', {
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

//If it's not a system message, append the username to it
const generateMessage = (data, message, isSystemMessage) => {
    let userName;
    let finalMessage;

    //Getting username
    if (data.receiverData) {
        if (data.receiverData.senderFirstName) {
            userName = data.receiverData.senderFirstName;
        } else {
            userName = data.receiverData.fullName;
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

//Get the number of seconds to write a message depending on the number of characters in the text
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
        console.log('=> Sending a welcome message: ', roomJID);
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

//Save the current step of the user and the data necessary for work
// * types:
// - getStep : Get step and all user data
// - setStep : Save a step or some user data
const userSteps = (type, jid, step, newData) => {
    //Get the index of the user in the array by his jid
    const userIndex = userStepsList.findIndex(user => user.name === jid);

    //If the user with the specified jid is not found, create a new data object for him.
    if (userIndex < 0) {
        console.log('=>=> Create new user step ' + 1 + ' ' + jid);
        const newUserData = {name: jid, step: 1, data: {}};
        userStepsList.push(newUserData);
        return newUserData;
    }

    //When receiving the getStep type, return all the data
    if (type === 'getStep') {
        return userStepsList[userIndex];
    }

    //Upon receipt of the setStepData type, update the data that is specified
    if (type === 'setStep') {
        // console.log('=>=> Set new step for user ' + newData + ' ' + jid);
        if (newData) {
            userStepsList[userIndex].data = newData;
        }
        if (step) {
            userStepsList[userIndex].step = step;
        }
        return true;
    }
    console.log('=>=> userSteps Error: ', type, jid, step, newData, userStepsList[userIndex])
    return false;
}

export {sendMessage, connectRoom, messageCheck, userSteps};