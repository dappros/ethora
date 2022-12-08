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

        if (messageCheck(handlerData.message, 'Raffle bot'))
            {
                return botInitiate(handlerData);
            }
    
    

    if (handlerData.receiverData.isSystemMessage && handlerData.receiverData.tokenAmount == 7) {
        if (messageCheck(handlerData.message, botOptions.botData.firstName + ' ' + botOptions.botData.lastName)) {
            return sendMessage(
                handlerData,
                messages.raffleBotReplies.durationToParticipate,
                'message',
                false,
                0,
                [{
                    name: '3 Minutes',
                    value: '3 Minutes'
                },
                {
                    name: '5 Minutes',
                    value: '5 Minutes'
                },
                {
                    name: '10 Minutes',
                    value: '10 Minutes'
                },
                {
                    name: '30 Minutes',
                    value: '30 Minutes'
                },
                {
                    name: '1 Hour',
                    value: '1 Hour'
                },
                {
                    name: '1 Day',
                    value: '1 Day'
                },
                {
                    name: 'Cancel',
                    value: 'Cancel'
                }
                ]
            );
        }
    }
}
export {router};