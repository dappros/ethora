import {sendMessage, userSteps} from "../actions.js";
import messages from "../config/messages.js";
import botOptions from "../config/config.js";
import {getRandomItem, transferNft, userPaymentVerify} from "../api.js";
import {sendErrorMessage} from "./error.js";

export const searchItemsHandler = (data) => {
    console.log('=> searchItemsHandler | Message received from ', data.receiver, data.message);
    let tokenAmount = 1;
    userPaymentVerify(data, botOptions.botData.collectFee).then(response => {
        if (!response) {
            return sendMessage(
                data,
                messages.errors.payment.wrongAmount + ': ' + botOptions.botData.collectFee,
                'message',
                false,
                0,
            );
        }

        getRandomItem().then((response) => {
            userSteps('setStep', data.receiver, 1);
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
                    console.log('transferNft Error', error);
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
        }).catch((error) => {
            console.log('getRandomItem Error', error)
            sendErrorMessage(data, messages.errors.payment.getRandomItemError)
        });
    }).catch(error => {
        console.log('userPaymentVerify Error: ', error);
        return sendMessage(
            data,
            messages.errors.payment.userPaymentVerifyErr,
            'message',
            false,
            0,
        );
    });
}