import {sendMessage} from "../actions.js";
import messages from "../config/messages.js";

export const helloMessageHandler = (data) => {
    console.log('=> helloMessageHandler || Message received from ', data.userJID, data.message);
    return sendMessage(
        data,
        messages.exampleBotMessage.helloPresence,
        'message',
        false,
        0,
    );
}