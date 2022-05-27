import {sendMessage, userSteps} from "../actions.js";
import messages from "../config/messages.js";

export const frontTurnMeHandler = (data) => {
    console.log('=> frontTurnMe | Message received from ', data.receiver, data.message);
    sendMessage(
        data.xmpp,
        data.receiver,
        'message',
        messages.visitingHut.openingHut,
        data.receiverData,
        false,
        0,
        data.stanzaId
    );
    userSteps('setStep', data.sender, 3);
}