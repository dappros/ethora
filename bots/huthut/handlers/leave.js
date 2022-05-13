import {sendMessage, userSteps} from "../actions.js";
import messages from "../config/messages.js";

export const leaveHandler = (xmpp, sender, receiver, message) => {
    console.log('=> Message received from ', receiver, message);
    userSteps('setStep', sender, 1);
    sendMessage(xmpp, receiver, 'message', messages.general.toTheBeginning);
}