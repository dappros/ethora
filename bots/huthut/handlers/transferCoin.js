import {sendMessage, userSteps} from "../actions.js";
import botOptions from "../config/config.js";
import messages from "../config/messages.js";
import {getRandomItem, transferNft} from "../api.js";
import {sendErrorMessage} from "./error.js";

export const transferCoinHandler = (data) => {
    console.log('=> transferCoinHandler | Message received from ', data.receiver, data.message);
    if(data.receiverData.attrs.tokenAmount < botOptions.botData.collectFee){
        return sendMessage(
            data,
            messages.errors.payment.wrongAmount+': '+botOptions.botData.collectFee,
            'message',
            false,
            0,
        );
    }

    let tokenAmount = 1;

    getRandomItem().then((response) => {
        userSteps('setStep', data.sender, 1);
        if (response) {
            sendMessage(
                data,
                messages.visitingHut.randomlyGotItem + response.tokenName,
                'message',
                false,
                0,
            );
            transferNft(response.nftId, data.receiverData.attrs.senderWalletAddress, tokenAmount).then(responseNft => {
                console.log('=> Transfer success', responseNft);
                return sendMessage(
                    data,
                    botOptions.botData.firstName + ' ' + botOptions.botData.lastName + ' -> ' + tokenAmount + ' ' + response.tokenName + ' -> ' + data.receiverData.attrs.senderFirstName,
                    'message',
                    true,
                    tokenAmount,
                );
            }).catch((error) => {
                console.log('transferNft ERROR', error);
                return sendErrorMessage(data, messages.errors.payment.transferTokenError)
            })
        } else {
            return sendMessage(
                data,
                messages.visitingHut.noItemsInBot,
                'message',
                false,
                0,
            );
        }
    }).catch((err) => {
        console.log('ERROR', err)
        sendErrorMessage(data, messages.errors.payment.getRandomItemError)
    })
}