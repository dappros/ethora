import {deleteApiData} from "../../api.js";
import {sendMessage, userSteps} from "../../actions.js";
import messages from "../../config/messages.js";

export const exactAmountProcessing = (dataAPI, data) => {
    if (dataAPI.total > 0) {
        deleteApiData(dataAPI.items[0]._id).then(result => {
            console.log("exactAmountProcessing | success delete data ", result);
        }).catch(error => {
            console.log("exactAmountProcessing | delete error ", error);
        });
    }

    userSteps('setStep', data.userJID, 2);

    return sendMessage(
        data,
        messages.raffleBotReplies.durationToParticipate,
        'message',
        false,
        0,
        messages.menu.mainMenu
    );
}