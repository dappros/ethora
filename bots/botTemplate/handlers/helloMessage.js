import {sendMessage} from "../actions.js";
import messages from "../config/messages.js";

export const presenceMessageHandler = (data) => {
    console.log('=> presenceMessageHandler || Message received from ', data.userJID, data.message);
    return sendMessage(
        data,
        messages.exampleBotMessage.helloPresence,
        'message',
        false,
        0,
    );
}