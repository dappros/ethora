import {getUserRooms, sendMessage} from "../actions.js";
import messages from "../config/messages.js";

export const testHandler = (data) => {
    console.log('=> Message received from ', data.userJID, data.message);
    sendMessage(
        data,
        'get rooms',
        'message',
        false,
        0,
    );
}