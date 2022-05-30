import {sendMessage} from "../actions.js";
import messages from "../config/messages.js";

export const helpHandler = (data) => {
    console.log('=> helpHandler | Message received from ', data.receiver, data.message);
    return sendMessage(
        data,
        data.userStep === 1 ? messages.help.whereToBegin : messages.help.secondStep,
        'message',
        false,
        0,
    );
}