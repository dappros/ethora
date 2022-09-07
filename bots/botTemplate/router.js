import {messageCheck, sendMessage, userData, userSteps} from "./actions.js";
import {leaveHandler} from "./handlers/leave.js";
import messages from "./config/messages.js";
import botOptions from "./config/config.js";
const router = (handlerData) => {

    if (messageCheck(handlerData.message, 'close') || messageCheck(handlerData.message, 'leave')) {
        return leaveHandler(handlerData);
    }
    // if (messageCheck(handlerData.message, 'test')) {
    //
    //     // console.log('RUN TEST GET USER ROOMS => => => ', connectData.botName+'@'+connectData.botAddress)
    //     // return getBotRoomsStanza(xmpp, connectData);
    // }


    if (handlerData.receiverData.isSystemMessage && handlerData.receiverData.tokenAmount > 0) {
        if (messageCheck(message, botOptions.botData.firstName + ' ' + botOptions.botData.lastName)) {
            return sendMessage(
                handlerData,
                messages.bot.tnxForTransaction,
                'message',
                false,
                0,
            );
        }
    }
    // receiverData.attrs.notDisplayedValue

}
export {router};