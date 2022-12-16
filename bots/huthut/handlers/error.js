import {sendMessage} from "../actions.js";
import messages from "../config/messages.js";

export const errorHandler = (data) => {
    console.log('=> errorHandler | Message received from ', data.receiver, data.message);
    if (data.userStep === 2) {
        if(data.receiverData.attrs.isSystemMessage){
            return sendMessage(
                data,
                messages.errors.paymentError,
                'message',
                false,
                0,
            );
        }
    }
    if (data.userStep === 3) {
        if (!Number.isInteger(data.message) || data.message > 3 || data.message < 1) {
            return sendMessage(
                data,
                messages.errors.wrongNumber,
                'message',
                false,
                0,
            );
        }
    }
}

export const sendErrorMessage = (data, message) => {
    return sendMessage(
        data,
        message,
        'message',
        false,
        0,
    );
}