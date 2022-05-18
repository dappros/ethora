import {sendMessage, userSteps} from "../actions.js";
import messages from "../config/messages.js";

export const backTurnForestHandler = (xmpp, sender, receiver, message, receiverData) => {
    console.log('=> backTurnForestHandler | Message received from ', receiver, message);
    sendMessage(xmpp, receiver, 'message', messages.visitingHut.firstGreeting, receiverData);
    userSteps('setStep', sender, 2);
}