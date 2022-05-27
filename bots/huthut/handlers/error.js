import {sendMessage} from "../actions.js";
import messages from "../config/messages.js";

export const errorHandler = (data) => {
    console.log('=> errorHandler | Message received from ', data.receiver, data.message);
    if (data.userStep === 2) {
        if(data.receiverData.attrs.isSystemMessage){
            return sendMessage(
                data.xmpp,
                data.receiver,
                'message',
                messages.errors.paymentError,
                data.receiverData,
                false,
                0,
                data.stanzaId
            );
        }
    }
    if (data.userStep === 3) {
        if (!Number.isInteger(data.message) || data.message > 3 || data.message < 1) {
            return sendMessage(
                data.xmpp,
                data.receiver,
                'message',
                messages.errors.wrongNumber,
                data.receiverData,
                false,
                0,
                data.stanzaId
            );
        }
    }
}