import {connectRoom, messageCheck, sendMessage, userSteps} from "./actions.js";
import {testHandler} from "./handlers/test.js";
import {backTurnForestHandler} from "./handlers/backTurnForest.js";
import {helpHandler} from "./handlers/help.js";
import {leaveHandler} from "./handlers/leave.js";
import {frontTurnMeHandler} from "./handlers/frontTurnMe.js";
import {errorHandler} from "./handlers/error.js";
import {storeItemHandler} from "./handlers/storeItem.js";
import {searchItemsHandler} from "./handlers/searchItems.js";
import {userPayHandler} from "./handlers/userPay.js";
import messages from "./config/messages.js";

const router = (xmpp, message, sender, receiver, requestType, receiverData, stanzaId) => {
    if (requestType === 'x' && message.match(/\binvite\S*\b/g)) {
        console.log('=> The bot was invited to the chat room ', receiver);
        connectRoom(xmpp, sender, receiver);
    }

    if (requestType === 'body') {
        let userStep = userSteps('getStep', sender, null);

        let handlerData = {
            xmpp,
            sender,
            receiver,
            message,
            userStep,
            receiverData,
            stanzaId,
        };

        //actions that are performed in the first step, when the bot does not yet know what the user wants
        if (userStep === 1) {
            if (messageCheck(message, 'hut test')) {
                return testHandler(handlerData);
            }

            if (messageCheck(message, 'hut back turn')) {
                return backTurnForestHandler(handlerData);
            }
        }

        if (userStep === 2) {
            if (messageCheck(message, 'hut front turn')) {
                return frontTurnMeHandler(handlerData);
            }
        }

        if (userStep === 3) {
            if (Number.isInteger(Number(message)) && message <= 3 && message > 0) {
                if (Number(message) === 1 || Number(message) === 2) {
                    return userPayHandler(handlerData, Number(message));
                }

                if (Number(message) === 3) {
                    return leaveHandler(handlerData);
                }
            } else {
                return errorHandler(handlerData);
            }
        }

        //In userPayHandler, step 4 is specified to handle the item placement operation
        if (userStep === 4 && receiverData.attrs.isSystemMessage && receiverData.attrs.tokenAmount >= 1) {
            return storeItemHandler(handlerData)
        }

        //In userPayHandler, step 5 is specified to handle the get item operation.
        if (userStep === 5 && receiverData.attrs.isSystemMessage && receiverData.attrs.tokenAmount >= 1) {
            return searchItemsHandler(handlerData)
        }

        //Global message handlers not associated with steps
        if (receiverData.attrs.isSystemMessage && receiverData.attrs.tokenAmount > 0) {
            return sendMessage(
                handlerData,
                messages.visitingHut.tnxForTransaction,
                'message',
                false,
                0,
            );
        }

        if (messageCheck(message, 'hut close') || messageCheck(message, 'hut leave')) {
            return leaveHandler(handlerData);
        }

        if (messageCheck(message, 'hut') || messageCheck(message, 'hut help')) {
            return helpHandler(handlerData);
        }

    }
}
export {router};