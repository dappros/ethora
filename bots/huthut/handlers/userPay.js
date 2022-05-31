import {sendMessage, userSteps} from "../actions.js";
import messages from "../config/messages.js";

export const userPayHandler = (data, type) => {
    console.log('=> userPayHandler | Message received from ', data.receiver, data.message);
    if(type === 1){
        userSteps('setStep', data.sender, 4);
        return sendMessage(
            data,
            messages.visitingHut.choseItemPlacement,
            'message',
            false,
            0,
        );
    }

    if(type === 2){
        userSteps('setStep', data.sender, 5);
        return sendMessage(
            data,
            messages.visitingHut.choseReceiveItem,
            'message',
            false,
            0,
        );
    }

}