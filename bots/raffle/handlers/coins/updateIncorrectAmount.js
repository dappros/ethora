import {updateApiData} from "../../api.js";
import {sendMessage} from "../../actions.js";
import messages from "../../config/messages.js";
import {requestError} from "../errors.js";

export const updateIncorrectAmount = (dataAPI, data, userCoins, coinDifference) => {
    updateApiData(dataAPI.items[0]._id, {amount: userCoins}).then(() => {
        return sendMessage(
            data,
            String(messages.raffleBotReplies.notEnoughCoins + " " + coinDifference + " coins."),
            'message',
            false,
            [],
        );
    }).catch(error => {
        requestError(data, 'updateApiData', error)
    })
}