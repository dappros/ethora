import {messageCheck, sendMessage, userSteps} from "./actions.js";
import {leaveHandler} from "./handlers/leave.js";
import {helpHandler} from "./handlers/help.js";
import {botInitiate} from "./handlers/botInitiate.js";
import {gettingCoinsHandler} from "./handlers/coins/gettingCoinsHandler.js";
import {requestItem} from "./handlers/requestItem.js";
import {registrationActive} from "./handlers/registrationActive.js";

export let currentItem = {
    nftId: "",
    nftName: "",
    ownerWallet: "",
    ownerName: "",
    status: ""
}
export let participants = [];

const router = (handlerData) => {

    if(currentItem.status === "work"){
        userSteps('setStep', handlerData.userJID, 4);
    }
    if(currentItem.status === "stop"){
        userSteps('setStep', handlerData.userJID, 1);
        participants = [];
        currentItem.status = "";
    }

    handlerData.userStep = userSteps('getStep', handlerData.userJID);

    //If the user sent coins
    if (handlerData.receiverData.isSystemMessage &&
        handlerData.receiverData.tokenAmount > 0 &&
        handlerData.receiverData.receiverMessageId !== '0'
    ) {
        return gettingCoinsHandler(handlerData);
    }

    //If the user sent items
    if (handlerData.receiverData.isSystemMessage &&
        handlerData.receiverData.tokenAmount > 0 &&
        handlerData.receiverData.receiverMessageId === '0'
        &&
        handlerData.userStep.step === 3
    ) {
        return registrationActive(handlerData);
    }

    if (messageCheck(handlerData.message, 'close') || messageCheck(handlerData.message, 'leave')) {
        return leaveHandler(handlerData);
    }

    if (messageCheck(handlerData.message, 'bot help') ||
        messageCheck(handlerData.message, 'bots help') ||
        messageCheck(handlerData.message, 'bot info') ||
        messageCheck(handlerData.message, 'bots info')) {
        return helpHandler(handlerData);
    }

    if (messageCheck(handlerData.message, 'Raffle bot') ||
        messageCheck(handlerData.message, 'raffle')
    ) {
        return botInitiate(handlerData);
    }

    if (handlerData.userStep.step === 2) {
        return requestItem(handlerData);
    }

    if (handlerData.userStep.step === 4) {
        if(handlerData.receiverData.senderWalletAddress !== currentItem.ownerWallet &&
        participants.filter(item => item.wallet === handlerData.receiverData.senderWalletAddress).length === 0){

            participants.push({
                name: handlerData.receiverData.senderFirstName + " " + handlerData.receiverData.senderLastName,
                wallet: handlerData.receiverData.senderWalletAddress
            });
            return sendMessage(
                handlerData,
                handlerData.receiverData.senderFirstName + ", you’re in!",
                'message',
                false,
                0,
            );
        }

    }

}

export {router};