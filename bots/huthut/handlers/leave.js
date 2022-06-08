import {sendMessage, userSteps} from "../actions.js";
import messages from "../config/messages.js";

export const leaveHandler = (data) => {
    console.log('=> leaveHandler | Message received from ', data.receiver, data.message);
    userSteps('setStep', data.receiver, 1);
    return sendMessage(
        data,
        messages.general.toTheBeginning,
        'message',
        false,
        0,
    );
}