import {sendMessage} from "../actions.js";
import messages from "../config/messages.js";

export const botInitiate = (data) => {
    console.log('=> botInitiate | Message received from ', data.userJID, data.message);

    return sendMessage(
        data,
        messages.raffleBotReplies.initiateBot,
        'message',
        false,
        0,
    );
}
