import {sendMessage, userSteps} from "../actions.js";
import messages from "../config/messages.js";

export const leaveHandler = (data) => {
    console.log('=> leaveHandler | Message received from ', data.receiver, data.message);
    userSteps('setStep', data.sender, 1);
    sendMessage(
        data.xmpp,
        data.receiver,
        'message',
        messages.general.toTheBeginning,
        data.receiverData,
        false,
        0,
        data.messageId
    );
}