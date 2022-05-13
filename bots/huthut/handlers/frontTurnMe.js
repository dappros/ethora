import {sendMessage, userSteps} from "../actions.js";
import messages from "../config/messages.js";

export const frontTurnMe = (xmpp, sender, receiver, message) => {
    console.log('=> Message received from ', receiver, message);
    userSteps('setStep', sender, 3);
    sendMessage(xmpp, receiver, 'message', messages.visitingHut.openingHut);
}