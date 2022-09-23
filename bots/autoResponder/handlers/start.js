import {sendMessage} from "../actions.js";
import messages from "../config/messages.js";

export const startHandler = (data) => {
    console.log('=> Message received from ', data.userJID, data.message);
    sendMessage(
        data,
        messages.didYouWantToLearnMore,
        'message',
        false,
        0,
        [{
            name: 'Learn about products & services',
            value: 'Learn about products & services',
            notDisplayedValue: "send_information"
        }, {
            name: 'Chat',
            value: 'Chat',
            notDisplayedValue: "chat"
        }]
    );
}