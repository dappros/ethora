import {sendMessage} from "../actions.js";
import {transferItem} from "../api.js";
import botOptions from "../config/config.js";

export const transferItemHandler = (data) => {
    console.log('=> Message received from ', data.userJID, data.message);
    transferItem('6391ad07d1fbc4394f61d905', data.receiverData.senderWalletAddress, 1).then(() => {
        sendMessage(
            data,
            botOptions.botData.firstName + ' ' + botOptions.botData.lastName + ' -> ' + 1 + ' ' + 'JO' + ' -> ' + data.receiverData.senderFirstName + " " + data.receiverData.senderLastName,
            'message',
            true,
            0,
        );
    })

}