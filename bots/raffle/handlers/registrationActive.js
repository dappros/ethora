import {sendMessage} from "../actions.js";
import messages from "../config/messages.js";

export const registrationActive = (data) => {

    console.log('=> registrationActive || Message received from ', data.userJID, data.message);

    sendMessage(
        data,
        messages.raffleBotReplies.raffleRegistrationOn,
        'message',
        false,
        0,
    );

    return sendMessage(
        data,
        messages.raffleBotReplies.countAsParticipant,
        'message',
        false,
        0,
    )
}