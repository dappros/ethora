import {sendMessage, userSteps} from "../actions.js";
import messages from "../config/messages.js";

export const searchItemsHandler = (data) => {
    console.log('=> searchItemsHandler | Message received from ', data.receiver, data.message);
    userSteps('setStep', data.sender, 1);
    sendMessage(
        data.xmpp,
        data.receiver,
        'message',
        messages.visitingHut.searchItemsSuccess,
        data.receiverData,
        false,
        0,
        data.stanzaId
    );
}