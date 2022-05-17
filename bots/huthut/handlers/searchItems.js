import {sendMessage, userSteps} from "../actions.js";
import messages from "../config/messages.js";

export const searchItemsHandler = (xmpp, sender, receiver, message, receiverData) => {
    console.log('=> Message received from ', receiver, message);
    userSteps('setStep', sender, 1);
    sendMessage(xmpp, receiver, 'message', messages.visitingHut.searchItemsSuccess, receiverData);
}