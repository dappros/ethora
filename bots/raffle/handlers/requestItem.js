import {sendMessage, userSteps} from "../actions.js";
import messages from "../config/messages.js";

export const requestItem = (data) => {
    console.log('=> requestItem || Message received from ', data.userJID, data.message);
    userSteps('setStep', data.userJID, 3);

    return sendMessage(
        data,
        messages.raffleBotReplies.sendPrizeItem,
        'message',
        false,
        0,
    );
}