import {sendMessage} from "../actions.js";
import messages from "../config/messages.js";

export const helpHandler = (data) => {
    console.log('=> helpHandler | Message received from ', data.receiver, data.message);
    sendMessage(
        data.xmpp,
        data.receiver,
        'message',
        data.userStep === 1 ? messages.help.whereToBegin : messages.help.secondStep,
        data.receiverData,
        false,
        0,
        data.stanzaId
    );
}