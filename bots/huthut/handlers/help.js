import {sendMessage} from "../actions.js";
import messages from "../config/messages.js";

export const helpHandler = (xmpp, sender, receiver, message, userStep) => {
    console.log('=> Message received from ', receiver, message);
    if(userStep === 1){
        sendMessage(xmpp, receiver, 'message', messages.help.whereToBegin);
    }

    if(userStep === 2){
        sendMessage(xmpp, receiver, 'message', messages.help.secondStep);
    }
}