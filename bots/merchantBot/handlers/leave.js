import {sendMessage, userData, userSteps} from "../actions.js";
import messages from "../config/messages.js";

export const leaveHandler = (data) => {
    console.log('=> leaveHandler | Message received from ', data.receiver, data.message);
    userSteps('setStep', data.receiverData.attrs.senderJID, 1);
    userData('setData', data.userJID, [], 'itemData');
    userData('setData', data.userJID, 0, 'sendCoins');
    userData('setData', data.userJID, 0, 'itemDataIndex');

    return sendMessage(
        data,
        'You exited the merchant process',
        'message',
        false,
        0,
    );
}