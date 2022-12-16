import {sendMessage} from "../actions.js";
import messages from "../config/messages.js";

export const requestError = (data, request, error) =>{
    console.log(request+' || Error: ', error);
    return sendMessage(
        data,
        messages.errors.requestError,
        'message',
        false,
        0,
    );
}