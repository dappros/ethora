import {sendMessage} from "../actions.js";
import messages from "../config/messages.js";

export const testHandler = (xmpp, sender, receiver, message, receiverData) => {
    console.log('=> Message received from ', receiver, message);
    sendMessage(xmpp, receiver, 'message', messages.testMessage, receiverData);
}