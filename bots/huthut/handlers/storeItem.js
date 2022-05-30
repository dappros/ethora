import {sendMessage, userSteps} from "../actions.js";
import messages from "../config/messages.js";

export const storeItemHandler = (data) => {
    console.log('=> storeItemHandler | Message received from ', data.receiver, data.message);
    userSteps('setStep', data.sender, 1);
    return sendMessage(
        data,
        messages.visitingHut.storeItemSuccess,
        'message',
        false,
        0,
    );
}