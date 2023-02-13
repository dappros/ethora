import {sendMessage} from "../actions.js";
import messages from "../config/messages.js";

export const helpHandler = (data) => {
    console.log('=> helpHandler | Message received from ', data.userJID, data.message);

    return sendMessage(
        data,
        messages.exampleBotMessage.helpMessage,
        'message',
        false,
        0,
    );

}