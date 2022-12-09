import {logCurrentHandler, messageCheck, sendMessage, userSteps} from "../../actions.js";
import botOptions from "../../config/config.js";
import messages from "../../config/messages.js";
import {deleteApiData, getFilteredApiData} from "../../api.js";
import {requestError} from "../errors.js";
import {exactAmountProcessing} from "./exactAmountProcessing.js";
import {updateIncorrectAmount} from "./updateIncorrectAmount.js";
import {newIncorrectAmount} from "./newIncorrectAmount.js";

export const gettingCoinsHandler = (data) => {
    logCurrentHandler('gettingCoinsHandler', data.userJID, data.message);
    const coinAmount = 7;

    if(data.userStep !== 1){
        return sendMessage(
            data,
            messages.exampleBotMessage.tnxForTransaction,
            'message',
            false,
            0,
            []
        );
    }

    if (messageCheck(data.message, botOptions.botData.firstName + ' ' + botOptions.botData.lastName)) {
        const filterData = {
            where: {
                creator_jid: data.botJID,
                user_jid: data.userJID,
                type: 'replenishments'
            }
        }
        getFilteredApiData(filterData).then(result => {
            let savedCoins = 0;
            if (result.total > 0) {
                savedCoins = result.items[0].amount;
            }

            if (data.receiverData.tokenAmount >= coinAmount) {
                return exactAmountProcessing(result, data);
            }

            if (data.receiverData.tokenAmount < coinAmount) {
                const userCoins = Number(savedCoins) + Number(data.receiverData.tokenAmount);
                const coinDifference = Number(coinAmount) - userCoins;

                if (coinDifference > 0) {

                    if (result.total > 0) {
                        return updateIncorrectAmount(result, data, userCoins, coinDifference);
                    } else {
                        return newIncorrectAmount(data, coinDifference);
                    }

                } else {
                    deleteApiData(result.items[0]._id).then(() => {

                        userSteps('setStep', data.userJID, 2);

                        return sendMessage(
                            data,
                            messages.raffleBotReplies.durationToParticipate,
                            'message',
                            false,
                            0,
                            messages.menu.mainMenu
                        );
                    }).catch(error => {
                        requestError(data, 'deleteApiData', error)
                    });
                }
            }
        }).catch(error => {
            requestError(data, 'getFilteredApiData', error)
        })
    }
}

