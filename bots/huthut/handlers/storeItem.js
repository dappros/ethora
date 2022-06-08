import {sendMessage, userSteps} from "../actions.js";
import messages from "../config/messages.js";
import botOptions from "../config/config.js";
import {userPaymentVerify} from "../api.js";

export const storeItemHandler = (data) => {
    console.log('=> storeItemHandler | Message received from ', data.receiver, data.message);
    userPaymentVerify(data, botOptions.botData.storeFee).then(response => {
        if (!response) {
            return sendMessage(
                data,
                messages.errors.payment.wrongAmount + ': ' + botOptions.botData.storeFee,
                'message',
                false,
                0,
            );
        }
        userSteps('setStep', data.receiver, 1);
        return sendMessage(
            data,
            messages.visitingHut.storeItemSuccess,
            'message',
            false,
            0,
        );
    }).catch(error => {
        console.log('storeItemHandler Error: ', error);
        return sendMessage(
            data,
            messages.errors.payment.userPaymentVerifyErr,
            'message',
            false,
            0,
        );
    });
}