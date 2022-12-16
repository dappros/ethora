import {sendMessage} from "../actions.js";
import messages from "../config/messages.js";

export const userLimitHandler = (data) => {
    console.log('=> Message received from ', data.userJID, data.message);
    sendMessage(
        data,
        messages.exampleBotMessage.userLimit,
        'message',
        false,
        0,
    );
}