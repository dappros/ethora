import {sendMessage, userData, userSteps} from "../actions.js";
import messages from "../config/messages.js";

export const leaveHandler = (data) => {
    console.log('=> leaveHandler | Message received from ', data.receiver, data.message);
    userSteps('setStep', data.receiverData.attrs.senderJID, 1);
    userData('setData', data.userJID, null, 'buttonType');
    userData('setData', data.userJID, 0, 'itemsCounter');

    return sendMessage(
        data,
        messages.general.toTheBeginning,
        'message',
        false,
        0,
        messages.bot.helloMessageButtons
    );
}