import {sendMessage} from "../actions.js";
import botOptions from "../config/config.js";
import messages from "../config/messages.js";
import {transferToken} from "../api.js";
import {sendErrorMessage} from "./error.js";

export const transferCoinHandler = (data) => {
    console.log('=> transferCoinHandler | Message received from ', data.receiver, data.message);
    let tokenAmount = 1;

    transferToken(botOptions.botData.tokenSymbol, botOptions.botData.tokenName, tokenAmount, data.receiverData.attrs.senderWalletAddress).then(response => {
        console.log('=> Transfer success', response.data);
        return sendMessage(
            data,
            botOptions.botData.firstName + ' ' + botOptions.botData.lastName + ' -> ' + tokenAmount + ' ' + botOptions.botData.tokenName + ' -> ' + data.receiverData.attrs.senderFirstName,
            'message',
            true,
            tokenAmount,
        );
    }).catch((error) => {
        console.log('transferToken ERROR', error)
        sendErrorMessage(data, messages.errors.payment.transferTokenError)
    })

}