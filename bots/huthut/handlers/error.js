import {sendMessage} from "../actions.js";
import messages from "../config/messages.js";

export const errorHandler = (xmpp, sender, receiver, message, userStep) => {
    console.log('=> Message received from ', receiver, message);
    if(userStep === 3){
        if(!Number.isInteger(message) || message > 3 || message < 1){
            sendMessage(xmpp, receiver, 'message', messages.errors.wrongNumber);
        }
    }
}