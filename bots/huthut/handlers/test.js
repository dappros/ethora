import {sendMessage} from "../actions.js";
import messages from "../config/messages.js";

export const testHandler = (data) => {
    console.log('=> Message received from ', data.receiver, data.message);
    sendMessage(
        data.xmpp,
        data.receiver,
        'message',
        messages.testMessage,
        data.receiverData,
        false,
        0,
        data.messageId
    );
}