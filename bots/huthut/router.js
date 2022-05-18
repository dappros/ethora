import {connectRoom, messageCheck, userSteps} from "./actions.js";
import {testHandler} from "./handlers/test.js";
import {backTurnForestHandler} from "./handlers/backTurnForest.js";
import {helpHandler} from "./handlers/help.js";
import {leaveHandler} from "./handlers/leave.js";
import {frontTurnMeHandler} from "./handlers/frontTurnMe.js";
import {errorHandler} from "./handlers/error.js";
import {storeItemHandler} from "./handlers/storeItem.js";
import {searchItemsHandler} from "./handlers/searchItems.js";

const router = (xmpp, message, sender, receiver, requestType, receiverData) => {
    if (requestType === 'x' && message.match(/\binvite\S*\b/g)) {
        console.log('=> The bot was invited to the chat room ', receiver);
        connectRoom(xmpp, sender, receiver);
    }

    if (requestType === 'body') {
        let userStep = userSteps('getStep', sender, null);
        //actions that are performed in the first step, when the bot does not yet know what the user wants
        if (userStep === 1) {
            if (messageCheck(message, 'hut test')) {
                testHandler(xmpp, sender, receiver, message, receiverData);
            } else if (messageCheck(message, 'hut back turn forest')) {
                backTurnForestHandler(xmpp, sender, receiver, message, receiverData);
            } else if (messageCheck(message, 'hut') || messageCheck(message, 'hut help')) {
                helpHandler(xmpp, sender, receiver, message, userStep, receiverData);
            }
        }

        if (userStep === 2) {
            if (messageCheck(message, 'hut front turn me')) {
                frontTurnMeHandler(xmpp, sender, receiver, message, receiverData);
            }else if(messageCheck(message, 'hut') || messageCheck(message, 'hut help')){
                helpHandler(xmpp, sender, receiver, message, userStep, receiverData);
            }
        }

        if (userStep === 3) {
            if(Number.isInteger(Number(message)) && message <= 3){
                if(Number(message) === 1){
                    storeItemHandler(xmpp, sender, receiver, message, receiverData);
                }else if(Number(message) === 2){
                    searchItemsHandler(xmpp, sender, receiver, message, receiverData);
                }else if(Number(message) === 3){
                    leaveHandler(xmpp, sender, receiver, message, receiverData);
                }else{
                    errorHandler(xmpp, sender, receiver, message, userStep, receiverData);
                }
            }else{
                errorHandler(xmpp, sender, receiver, message, userStep, receiverData);
            }
        }

        if (messageCheck(message, 'hut close') || messageCheck(message, 'hut leave')) {
            leaveHandler(xmpp, sender, receiver, message, userStep, receiverData);
        }

    }
}
export {router};