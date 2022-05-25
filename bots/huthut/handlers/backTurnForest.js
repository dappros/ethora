import {sendMessage, userSteps} from "../actions.js";
import messages from "../config/messages.js";

export const backTurnForestHandler = (data) => {
    console.log('=> backTurnForestHandler | Message received from ', data.receiver, data.message);
    sendMessage(
        data.xmpp,
        data.receiver,
        'message',
        messages.visitingHut.firstGreeting,
        data.receiverData,
        false,
        0,
        data.messageId
    );
    userSteps('setStep', data.sender, 2);
}