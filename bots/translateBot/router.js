import {messageCheck, sendMessage, userSteps} from "./actions.js";
import {leaveHandler} from "./handlers/leave.js";
import messages from "./config/messages.js";
import botOptions from "./config/config.js";
import {helpHandler} from "./handlers/help.js";
// import translate from "google-translate-api";
import {translate} from "@vitalets/google-translate-api";
import {translateText} from "./api.js";


export let muteRoomList = [];

const router = (handlerData) => {
    const roomMuteIndex = muteRoomList.indexOf(handlerData.roomJID)

    if(roomMuteIndex > -1){
        if (messageCheck(handlerData.message, 'start translate') ||
            messageCheck(handlerData.message, 'start babelfish')) {
            // return leaveHandler(handlerData);
            muteRoomList.splice(roomMuteIndex, 1);

            return sendMessage(
                handlerData,
                'OK, I start translating',
                'message',
                false,
                0,
            );
        }

        return;
    }

    handlerData.userStep = userSteps('getStep', handlerData.userJID);

    // if (messageCheck(handlerData.message, 'close') || messageCheck(handlerData.message, 'leave')) {
    //     // return leaveHandler(handlerData);
    //     return muteRoomList.push(handlerData.roomJID)
    //
    // }

    if (messageCheck(handlerData.message, 'stop translate') ||
        messageCheck(handlerData.message, 'stop babelfish')) {
        // return leaveHandler(handlerData);
        muteRoomList.push(handlerData.roomJID)

        return sendMessage(
            handlerData,
            'OK, I will stop translating now.\nPlease write "start translate" or "start babelfish" for me to resume',
            'message',
            false,
            0,
        );
    }


    // if (messageCheck(handlerData.message, 'bot help') ||
    //     messageCheck(handlerData.message, 'bots help') ||
    //     messageCheck(handlerData.message, 'bot info') ||
    //     messageCheck(handlerData.message, 'bots info'))
    // {
    //     return helpHandler(handlerData);
    // }

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

    console.log("START TRANSLATE =")

    // translate(handlerData.message, {to: 'es'}).then(result => {
    //     console.log("FINISH TRANSLATE ==> ", result)
    //     return sendMessage(
    //         handlerData,
    //         result.text,
    //         'message',
    //         false,
    //         0,
    //     );
    // }).catch(error => {
    //     console.log(error);
    // })

    translateText(handlerData.message).then(result => {
        console.log("FINISH TRANSLATE ==> ", result)
        return sendMessage(
            handlerData,
            result,
            'message',
            false,
            0,
        );
    }).catch(error => {
        console.log(error)
    })

    // translate(handlerData.message, {to: 'es'}).then(result => {
    //     console.log("FINISH TRANSLATE ==> ", result.text)
    //     return sendMessage(
    //         handlerData,
    //         result.text,
    //         'message',
    //         false,
    //         0,
    //     );
    // }).catch(error => {
    //     console.log(error);
    // })




}
export {router};