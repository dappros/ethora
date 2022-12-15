import botOptions from "./config/config.js";
import {userData, userSteps} from "./actions.js";
import {helloMessageHandler} from "./handlers/helloMessage.js";

export const welcomePresence = (xmpp, roomJID, userJID, receiverData, receiverMessageId, connectData) => {
    console.log('WELCOME PRESENCE ==============================================================')
    let userDateStatus = userData('getData', userJID, null);
    let dateDifference = Math.abs(new Date(userDateStatus) - new Date()) / (1000 * 60);

    if (userDateStatus === true || dateDifference >= botOptions.botData.waitingAfterPresence) {
        console.log('=> Presence launched');

        userData('setData', userJID, new Date(), 'buttonType');
        userData('setData', userJID, '', 'buttonType');

        userSteps('setStep', userJID, 1);

        const data = {
            xmpp,
            roomJID,
            userJID,
            receiverData,
            receiverMessageId,
            connectData
        }

        helloMessageHandler(data);
    }
}