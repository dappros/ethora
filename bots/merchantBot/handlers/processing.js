import {messageCheck, sendMessage, userData, userSteps} from "../actions.js";
import messages from "../config/messages.js";
import {getListAnswersInGroup} from "../controllers/answers.js";
import {requestError} from "./errors.js";
import botOptions from "../config/config.js";

export const processingHandler = (data) => {
    console.log('=> processingHandler || Message received from ', data.receiver, data.message);
    let currentButtonType = userData('getData', data.userJID, null, 'buttonType');
    getListAnswersInGroup(data.receiverData.attrs.senderJID, currentButtonType).then(answerList => {

        let uniqueItemList;
        if(currentButtonType === 'MedicalReports'){
            let tmpArray = [];

            function itemCheck(item) {
                if (tmpArray.indexOf(item.answer_group) === -1) {
                    tmpArray.push(item.answer_group);
                    return true
                }
                return false;
            }

            uniqueItemList = answerList.filter((item) => itemCheck(item));
        }else{
            uniqueItemList = answerList
        }

        userSteps('setStep', data.receiverData.attrs.senderJID, 2);
        return sendMessage(
            data,
            'I have ' + uniqueItemList.length + ' records of '+currentButtonType+' for you. Would you like to:',
            'message',
            false,
            0,
            messages.bot.buttons[currentButtonType]
        );
    }).catch(error => {
        requestError(data, "processingHandler", error);
    });
}