import {logCurrentHandler, userSteps} from "../actions.js";
import {getBalance} from "../api.js";
import {requestError} from "./errors.js";
import {messagingTimeout} from "./helpers/messagingTimeout.js";
import {currentItem} from "../router.js";

export const registrationActive = (data) => {
    logCurrentHandler('registrationActive', data.userJID, data.message);
    const allUserStepData = userSteps('getStep', data.userJID);
    const buttonData = allUserStepData.data.raffleTimer;

    currentItem.nftName = data.message.split("->")[1].trim().substring(1).trim();

    getBalance().then(balanceData => {
        const filteredItems = balanceData.balance.filter(item => item.tokenType === 'NFT' && item.balance > 0 && item.tokenName === currentItem.nftName);
        currentItem.nftId = filteredItems[0].nftId;
        currentItem.status = "work";
        userSteps('setStep', data.userJID, 4);
        console.log(currentItem);

        return messagingTimeout(data, buttonData)

    }).catch(error => {
        requestError(data, 'getBalance', error)
    })

}