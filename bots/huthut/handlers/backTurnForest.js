import {sendMessage, userSteps} from "../actions.js";
import messages from "../config/messages.js";

export const backTurnForestHandler = (data) => {
    console.log('=> backTurnForestHandler | Message received from ', data.receiver, data.message);
    sendMessage(
        data,
        messages.visitingHut.firstGreeting,
        'message',
        false,
        0,
    );
    userSteps('setStep', data.sender, 2);
}