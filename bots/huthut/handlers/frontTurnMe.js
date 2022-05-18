import {sendMessage, userSteps} from "../actions.js";
import messages from "../config/messages.js";

export const frontTurnMeHandler = (xmpp, sender, receiver, message, receiverData) => {
    console.log('=> frontTurnMe | Message received from ', receiver, message);
    sendMessage(xmpp, receiver, 'message', messages.visitingHut.openingHut, receiverData);
    userSteps('setStep', sender, 3);
}