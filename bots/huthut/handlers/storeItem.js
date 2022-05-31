import {sendMessage, userSteps} from "../actions.js";
import messages from "../config/messages.js";
import botOptions from "../config/config.js";

export const storeItemHandler = (data) => {
    console.log('=> storeItemHandler | Message received from ', data.receiver, data.message);
    if(data.receiverData.attrs.tokenAmount < botOptions.botData.storeFee){
        return sendMessage(
            data,
            messages.errors.payment.wrongAmount+': '+botOptions.botData.storeFee,
            'message',
            false,
            0,
        );
    }
    userSteps('setStep', data.sender, 1);
    return sendMessage(
        data,
        messages.visitingHut.storeItemSuccess,
        'message',
        false,
        0,
    );
}