import {saveApiData} from "../../api.js";
import botOptions from "../../config/config.js";
import {sendMessage} from "../../actions.js";
import messages from "../../config/messages.js";
import {requestError} from "../errors.js";

export const newIncorrectAmount = (data, coinDifference) => {
    saveApiData({
        bot_name: botOptions.botData.firstName,
        creator_jid: data.botJID,
        user_jid: data.userJID,
        type: 'replenishments',
        amount: data.receiverData.tokenAmount
    }).then(() => {
        return sendMessage(
            data,
            String(messages.raffleBotReplies.notEnoughCoins + " " + coinDifference + " coins."),
            'message',
            false,
            [],
        );
    }).catch(error => {
        requestError(data, 'saveApiData', error)
    });
}