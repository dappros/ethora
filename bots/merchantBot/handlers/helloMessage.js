import {sendMessage, userData} from "../actions.js";
import messages from "../config/messages.js";
import {getUserData, saveUserData} from "../controllers/users.js";
import {requestError} from "./errors.js";
import {getListQuestions} from "../controllers/questions.js";
import {getListAnswers} from "../controllers/answers.js";

export const helloMessageHandler = (data) => {
    console.log('=> helloMessageHandler || Message received from ', data.userJID, data.message);
    userData('setData', data.userJID, '', 'deleteItem');

    getUserData(data.userJID).then(userData => {
        console.log('GET USER DATA =====> ', userData);
        let buttons = messages.bot.helloMessageButtons;

        //A) For new users
        if (!userData) {
            saveUserData(data.userJID, data.receiverData ? data.receiverData.attrs.senderFirstName : null).then(() => {
                buttons[0].name = messages.bot.helloMessageABtn;

                return sendMessage(
                    data,
                    messages.bot.helloMessageNewUser,
                    'message',
                    false,
                    0,
                    buttons
                );
            }).catch(error => {
                requestError(data, "saveUserData", error);
            });
        }

        if (userData) {
            getListQuestions().then(questionsList => {
                getListAnswers(data.userJID).then(userAnswers => {

                    //B) For existing users with bot form incomplete
                    if (userAnswers.length < questionsList.length) {
                        buttons[0].name = messages.bot.helloMessageBBtn;

                        return sendMessage(
                            data,
                            messages.bot.helloMessageWithoutIntake,
                            'message',
                            false,
                            0,
                            buttons
                        );
                    }

                    //C) For existing users with bot form complete
                    if (userAnswers.length === questionsList.length) {
                        buttons[0].name = messages.bot.helloMessageCBtn;

                        return sendMessage(
                            data,
                            messages.bot.helloMessage,
                            'message',
                            false,
                            0,
                            buttons
                        );
                    }
                }).catch(error => {
                    requestError(data, "getListAnswers", error);
                })
            }).catch(error => {
                requestError(data, "getListQuestions", error);
            })
        }
    }).catch(error => {
        requestError(data, "getUserData", error);
    })

}