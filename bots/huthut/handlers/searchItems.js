import {sendMessage, userSteps} from "../actions.js";
import messages from "../config/messages.js";

export const searchItemsHandler = (data) => {
    console.log('=> searchItemsHandler | Message received from ', data.receiver, data.message);
    userSteps('setStep', data.sender, 1);
    return sendMessage(
        data,
        messages.visitingHut.searchItemsSuccess,
        'message',
        false,
        0,
    );
}