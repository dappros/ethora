import {messageCheck, userSteps} from "./actions.js";
import {leaveHandler} from "./handlers/leave.js";
import {helpHandler} from "./handlers/help.js";
import {botInitiate} from "./handlers/botInitiate.js";
import {gettingCoinsHandler} from "./handlers/coins/gettingCoinsHandler.js";

const router = (handlerData) => {
    handlerData.userStep = userSteps('getStep', handlerData.userJID);

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

    if (handlerData.userStep === 2) {
        //    next step...
    }

}

export {router};