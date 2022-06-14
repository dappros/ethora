import {sendMessage} from "../actions.js";
import messages from "../config/messages.js";

export const helpHandler = (data) => {
    console.log('=> helpHandler | Message received from ', data.receiver, data.message);

    if(data.userStep === 1){
        return sendMessage(
            data,
            messages.help.whereToBegin,
            'message',
            false,
            0,
        );
    }

    if(data.userStep === 2){
        return sendMessage(
            data,
            messages.help.secondStep,
            'message',
            false,
            0,
        );
    }

    if(data.userStep === 4){
        return sendMessage(
            data,
            messages.visitingHut.toPlaceItemNeed,
            'message',
            false,
            0,
        );
    }

    if(data.userStep === 5){
        return sendMessage(
            data,
            messages.visitingHut.toGetItemNeed,
            'message',
            false,
            0,
        );
    }


}