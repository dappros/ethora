import {messageCheck, sendMessage, userData, userSteps} from "./actions.js";
import {testHandler} from "./handlers/test.js";
import {helpHandler} from "./handlers/help.js";
import {leaveHandler} from "./handlers/leave.js";
import messages from "./config/messages.js";
import botOptions from "./config/config.js";
import {startMint} from "./handlers/startMint.js";
import {ethers} from "ethers";
import {mintItem} from "./handlers/mintItem.js";

const router = (xmpp, message, roomJID, userJID, receiverData, receiverMessageId, connectData) => {
    let userStep = userSteps('getStep', receiverData.attrs.senderJID, null);
    let currentButtonType = userData('getData', userJID, null);

    let handlerData = {
        xmpp,
        message,
        roomJID,
        userJID,
        userStep,
        receiverData,
        receiverMessageId,
        connectData
    };


    if (messageCheck(message, 'close') || messageCheck(message, 'leave')) {
        return leaveHandler(handlerData);
    }

    if (messageCheck(message, 'help')) {
        return helpHandler(handlerData);
    }


console.log(receiverData.attrs)
    if(receiverData.attrs.botType === 'mintBot'){
        return startMint(handlerData);
    }

    if(userStep === 2){
        console.log('USER 2 STEP =============>    == = = == = ')
        let itemData = userData('getData', handlerData.userJID, null, 'itemData');

        if(receiverData.attrs.notDisplayedValue){
            console.log('=========================================',itemData.costs[receiverData.attrs.notDisplayedValue])
            userData('setData', handlerData.userJID, receiverData.attrs.notDisplayedValue, 'itemDataIndex');

            if(Number(itemData.costs[receiverData.attrs.notDisplayedValue]) === 0){
                sendMessage(
                    handlerData,
                    'Starting the Merchant process, please wait a couple of seconds.',
                    'message',
                    false,
                    0,
                );
                return mintItem(handlerData)
            }



            return sendMessage(
                handlerData,
                'Great. That would be '+ethers.utils.formatEther(itemData.costs[receiverData.attrs.notDisplayedValue])+' Coins, please.',
                'message',
                false,
                0,
            );
        }
        let itemDataIndex = userData('getData', handlerData.userJID, null, 'itemDataIndex');



        if (receiverData.attrs.isSystemMessage && receiverData.attrs.tokenAmount > 0) {
            let userCoins = userData('getData', handlerData.userJID, null, 'sendCoins');
            if(!userCoins){
                userCoins = 0
            }
            let currentCosts = ethers.utils.formatEther(itemData.costs[itemDataIndex])-userCoins;
            console.log('CHECK COINS == > == > == > ',currentCosts, ethers.utils.formatEther(itemData.costs[itemDataIndex]), userCoins)

            if(receiverData.attrs.tokenAmount < currentCosts){
                let lastCost = currentCosts-receiverData.attrs.tokenAmount
                userData('setData', handlerData.userJID, receiverData.attrs.tokenAmount, 'sendCoins');
                return sendMessage(
                    handlerData,
                    'You have not transferred enough coins, please add '+lastCost+' more coins.',
                    'message',
                    false,
                    0,
                );
            }

            if(receiverData.attrs.tokenAmount >= currentCosts){
                sendMessage(
                    handlerData,
                    'Starting the Merchant process, please wait a couple of seconds.',
                    'message',
                    false,
                    0,
                );
                return mintItem(handlerData)
            }

        }




    }



    // if (receiverData.attrs.isSystemMessage && receiverData.attrs.tokenAmount > 0) {
    //     if (messageCheck(message, botOptions.botData.firstName + ' ' + botOptions.botData.lastName)) {
    //         return sendMessage(
    //             handlerData,
    //             messages.bot.tnxForTransaction,
    //             'message',
    //             false,
    //             0,
    //         );
    //     }
    // }
    // receiverData.attrs.notDisplayedValue

}
export {router};