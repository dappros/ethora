import {messageCheck, sendMessage, userSteps} from "./actions.js";
import {leaveHandler} from "./handlers/leave.js";
import messages from "./config/messages.js";
import botOptions from "./config/config.js";
import {helpHandler} from "./handlers/help.js";
import { botInitiate } from "./handlers/botInitiate.js";

const router = (handlerData) => {
    handlerData.userStep = userSteps('getStep', handlerData.userJID);

    if (messageCheck(handlerData.message, 'close') || messageCheck(handlerData.message, 'leave')) {
        return leaveHandler(handlerData);
    }

    if (messageCheck(handlerData.message, 'bot help') ||
        messageCheck(handlerData.message, 'bots help') ||
        messageCheck(handlerData.message, 'bot info') ||
        messageCheck(handlerData.message, 'bots info'))
    {
        return helpHandler(handlerData);
    }

    if(handlerData.receiverData.isSystemMessage === false){
        if (messageCheck(handlerData.message, 'Raffle bot'))
            {
                return botInitiate(handlerData);
            }
    }
    

    if (handlerData.receiverData.isSystemMessage && handlerData.receiverData.tokenAmount > 0) {
        if (messageCheck(handlerData.message, botOptions.botData.firstName + ' ' + botOptions.botData.lastName)) {
            return sendMessage(
                handlerData,
                messages.exampleBotMessage.tnxForTransaction,
                'message',
                false,
                0,
            );
        }
    }
}
export {router};