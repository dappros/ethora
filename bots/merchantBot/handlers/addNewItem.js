import {sendMessage, userData} from "../actions.js";
import messages from "../config/messages.js";
import {setAnswer} from "../controllers/answers.js";
import {requestError} from "./errors.js";

export const addNewItemHandler = (data) => {
    console.log('=> addNewItemHandler || Message received from ', data.receiver, data.message);
    let currentButtonType = userData('getData', data.userJID, null, 'buttonType');

    setAnswer(0, data.message, data.userJID, currentButtonType).then(() => {
        userData('setData', data.userJID, data.message, 'deleteItem');

        let btnType = 'allergy';
        if(currentButtonType === 'Medications'){
            btnType = 'medication';
        }

        sendMessage(
            data,
            'Noted: ' + data.message + '\n\nPlease choose what to do next:',
            'message',
            false,
            0,
            [{
                name: 'Remove the last entry (' + data.message + ')',
                value: 'Delete'
            },
                {
                    name: 'Enter another '+btnType,
                    value: 'Enter another'
                },
                {
                    "name": "🚪 Go back to main menu",
                    "value": "leave"
                }]
        );
    }).catch(error => {
        requestError(data, "setAnswer", error);
    })
}