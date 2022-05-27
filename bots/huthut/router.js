import {connectRoom, messageCheck, userSteps} from "./actions.js";
import {testHandler} from "./handlers/test.js";
import {backTurnForestHandler} from "./handlers/backTurnForest.js";
import {helpHandler} from "./handlers/help.js";
import {leaveHandler} from "./handlers/leave.js";
import {frontTurnMeHandler} from "./handlers/frontTurnMe.js";
import {errorHandler} from "./handlers/error.js";
import {storeItemHandler} from "./handlers/storeItem.js";
import {searchItemsHandler} from "./handlers/searchItems.js";
import {transferCoinHandler} from "./handlers/transferCoin.js";
import botOptions from "./config/config.js";

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
                testHandler(handlerData);
            } else if (messageCheck(message, 'hut back turn forest')) {
                backTurnForestHandler(handlerData);
            } else if (messageCheck(message, 'hut') || messageCheck(message, 'hut help')) {
                helpHandler(handlerData);
            }
        }

        if (userStep === 2) {
            if(receiverData.attrs.isSystemMessage && receiverData.attrs.tokenAmount >= 1){
                let test = botOptions.botData.firstName+' '+botOptions.botData.lastName+' Coin';
                console.log('===========>', test)
                if (messageCheck(message, test)) {
                    transferCoinHandler(handlerData)
                }else{
                    errorHandler(handlerData);
                }
            }else{
                if (messageCheck(message, 'hut front turn me')) {
                    frontTurnMeHandler(handlerData);
                } else if (messageCheck(message, 'hut') || messageCheck(message, 'hut help')) {
                    helpHandler(handlerData);
                }
            }
        }

        if (userStep === 3) {
            if (Number.isInteger(Number(message)) && message <= 3) {
                if (Number(message) === 1) {
                    storeItemHandler(handlerData);
                } else if (Number(message) === 2) {
                    searchItemsHandler(handlerData);
                } else if (Number(message) === 3) {
                    leaveHandler(handlerData);
                } else {
                    errorHandler(handlerData);
                }
            } else {
                errorHandler(handlerData);
            }
        }

        if (messageCheck(message, 'hut close') || messageCheck(message, 'hut leave')) {
            leaveHandler(handlerData);
        }

    }
}
export {router};