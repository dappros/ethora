import botOptions from "./config/config.js";
import {userData, userSteps} from "./actions.js";
import {helloMessageHandler} from "./handlers/helloMessage.js";

export const welcomePresence = (handlerData) => {
    //Get latest presence date (true on first run)
    const userDateStatus = userData('getData', handlerData.userJID);
    //Get difference between current date and last presence date
    const dateDifference = Math.abs(new Date(userDateStatus) - new Date()) / (1000 * 60);

    //Send a message if the difference between the dates is greater than stated
    if (userDateStatus === true || dateDifference >= botOptions.botData.waitingAfterPresence) {
        console.log('=> Presence launched', dateDifference, botOptions.botData.waitingAfterPresence);

        //Reset presence date
        userData('setData', handlerData.userJID, new Date());
        //Reset user step
        userSteps('setStep', handlerData.userJID, 1);

        return helloMessageHandler(handlerData);
    }

    //Reset presence date if date difference is less than required
    if (dateDifference < botOptions.botData.waitingAfterPresence) {
        return userData('setData', handlerData.userJID, new Date());
    }
}