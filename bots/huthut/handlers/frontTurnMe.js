import {sendMessage, userSteps} from "../actions.js";
import messages from "../config/messages.js";

export const frontTurnMeHandler = (data) => {
    console.log('=> frontTurnMe | Message received from ', data.receiver, data.message);
    userSteps('setStep', data.sender, 3);
    return sendMessage(
        data,
        messages.visitingHut.openingHut,
        'message',
        false,
        0,
    );
}