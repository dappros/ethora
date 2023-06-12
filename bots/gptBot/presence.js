import botOptions from "./config/config.js";
import {userSteps} from "./actions.js";
import {presenceMessageHandler} from "./handlers/helloMessage.js";

export const welcomePresence = (handlerData) => {
    let dateDifference = 0;
    //Get latest presence date
    const allUserStepData = userSteps('getStep', handlerData.userJID);
    let dateLastPresenceUser = allUserStepData.data.date;
    if(dateLastPresenceUser){
        //Get difference between current date and last presence date
        dateDifference = Math.abs(new Date(dateLastPresenceUser) - new Date()) / (1000 * 60);
    }else{
        dateLastPresenceUser = false;
    }

    //Send a message if the difference between the dates is greater than stated
    if (!dateLastPresenceUser || dateDifference >= botOptions.botData.waitingAfterPresence) {
        console.log('=> Presence launched', dateDifference, botOptions.botData.waitingAfterPresence);

        //Reset step and presence date
        allUserStepData.data.date = new Date();
        userSteps('setStep', handlerData.userJID, 1, allUserStepData.data);

        return presenceMessageHandler(handlerData);
    }

    //Reset presence date if date difference is less than required
    if (dateDifference < botOptions.botData.waitingAfterPresence) {
        allUserStepData.data.date = new Date();
        return userSteps('setStep', handlerData.userJID, null, allUserStepData.data);
    }
}