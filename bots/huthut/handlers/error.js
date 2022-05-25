import {sendMessage} from "../actions.js";
import messages from "../config/messages.js";

export const errorHandler = (data) => {
    console.log('=> errorHandler | Message received from ', data.receiver, data.message);
    if(data.userStep === 3){
        if(!Number.isInteger(data.message) || data.message > 3 || data.message < 1){
            sendMessage(
                data.xmpp,
                data.receiver,
                'message',
                messages.errors.wrongNumber,
                data.receiverData,
                false,
                0,
                data.messageId
            );
        }
    }
}