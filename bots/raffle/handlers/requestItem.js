import {logCurrentHandler, sendMessage, userSteps} from "../actions.js";
import messages from "../config/messages.js";
import {currentItem} from "../router.js";

export const requestItem = (data) => {
    logCurrentHandler('requestItem', data.userJID, data.message);

    const allUserStepData = userSteps('getStep', data.userJID);
    allUserStepData.data.raffleTimer = data.receiverData.notDisplayedValue;
    currentItem.ownerWallet = data.receiverData.senderWalletAddress;
    currentItem.ownerName = data.receiverData.senderFirstName;

    userSteps('setStep', data.userJID, 3, allUserStepData.data);
    console.log("STEP DATA ", allUserStepData)

    return sendMessage(
        data,
        messages.raffleBotReplies.sendPrizeItem,
        'message',
        false,
        0,
    );
}