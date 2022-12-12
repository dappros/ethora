import {messageCheck, sendMessage, userSteps} from "./actions.js";
import {leaveHandler} from "./handlers/leave.js";
import {helpHandler} from "./handlers/help.js";
import {botInitiate} from "./handlers/botInitiate.js";
import {gettingCoinsHandler} from "./handlers/coins/gettingCoinsHandler.js";
import { requestItem } from "./handlers/requestItem.js";
import { registrationActive } from "./handlers/registrationActive.js";

const router = (handlerData) => {
    handlerData.userStep = userSteps('getStep', handlerData.userJID);

    //If the user sent coins
    if (handlerData.receiverData.isSystemMessage &&
        handlerData.receiverData.tokenAmount > 0 &&
        handlerData.receiverData.receiverMessageId !== '0'
    ) {
        return gettingCoinsHandler(handlerData);
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

    //If the user sent items
    if (handlerData.receiverData.isSystemMessage &&
        handlerData.receiverData.tokenAmount > 0 &&
        handlerData.receiverData.receiverMessageId === '0' &&
        handlerData.userStep.step === 3
    ) {
        sendMessage(
            handlerData,
            "I received your item, thanks!",
            'message',
            false,
            0,
            []
        );

        return registrationActive(handlerData);
    }

}

export {router};