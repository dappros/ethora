import {messageCheck, sendMessage, userSteps} from "./actions.js";
import {leaveHandler} from "./handlers/leave.js";
import messages from "./config/messages.js";
import botOptions from "./config/config.js";
import {helpHandler} from "./handlers/help.js";
import { botInitiate } from "./handlers/botInitiate.js";
import {transferItemHandler} from "./handlers/transferItemHandler.js";
import {getBalanceHandler} from "./handlers/getBalanceHandler.js";

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

        if (messageCheck(handlerData.message, 'Raffle bot'))
            {
                return botInitiate(handlerData);
            }
    }
    

    if (handlerData.receiverData.isSystemMessage && handlerData.receiverData.tokenAmount > 0) {
        if (messageCheck(handlerData.message, botOptions.botData.firstName + ' ' + botOptions.botData.lastName)) {
            if(handlerData.receiverData.tokenAmount >= 7){
                return sendMessage(
                    handlerData,
                    messages.raffleBotReplies.durationToParticipate,
                    'message',
                    false,
                    0,
                    messages.menu.mainMenu
                );
            }

            if(handlerData.receiverData.tokenAmount < 7){

            }
        }
    }

export {router};