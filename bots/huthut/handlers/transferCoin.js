import {sendMessage} from "../actions.js";
import botOptions from "../config/config.js";

export const transferCoinHandler = (data) => {
    console.log('=> transferCoinHandler | Message received from ', data.receiver, data.message);
    console.log('DATA=> ', data.receiverData)
    const tokenAmount = 1;
    sendMessage(
        data.xmpp,
        data.receiver,
        'message',
        botOptions.botData.firstName+' '+botOptions.botData.lastName+' -> '+tokenAmount+' Coin -> '+data.receiverData.attrs.senderFirstName,
        data.receiverData,
        true,
        tokenAmount,
        data.messageId
    );
}