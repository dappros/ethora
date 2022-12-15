import {sendMessage, userData, userSteps} from "../actions.js";
import messages from "../config/messages.js";
import {getListAnswers, getListAnswersInGroup, setAnswer} from "../controllers/answers.js";
import {transferToken} from "../api.js";
import botOptions from "../config/config.js";
import {questionHandler} from "./question.js";
import {getListQuestions, getQuestion, getQuestionsInGroup} from "../controllers/questions.js";

export const answerHandler = (data) => {
    console.log('=> answerHandler | Message received from ', data.userJID, data.message);
    let currentButtonType = userData('getData', data.userJID, null, 'buttonType');

    const userMessage = data.message;
    getListAnswersInGroup(data.receiverData.attrs.senderJID, currentButtonType).then(result => {
        const answerId = result.length+1;

        getQuestion(answerId).then(result => {
            let statusValidation = true;

            if(result.validation === 'year'){
                if(Number.isInteger(Number(userMessage)) && userMessage.length === 4){
                    statusValidation = true;
                }else{
                    statusValidation = false;
                    sendMessage(
                        data,
                        messages.errors.answerNumError,
                        'message',
                        false,
                        0,
                    );
                }
            }
            if(statusValidation){
                setAnswer(answerId, data.receiverData.attrs.isMediafile ? data.receiverData.attrs.location : userMessage, data.receiverData.attrs.senderJID, currentButtonType, '').then(() => {
                    // sendMessage(
                    //     data,
                    //     messages.bot.answerSaved,
                    //     'message',
                    //     false,
                    //     0,
                    // );

                    transferToken(botOptions.botData.tokenSymbol, botOptions.botData.tokenName, botOptions.botData.userReward, data.receiverData.attrs.senderWalletAddress).then(response => {
                        console.log('===> Transfer success', response);
                        userSteps('setStep', data.receiverData.attrs.senderJID, 1);
                        sendMessage(
                            data,
                            botOptions.botData.firstName + ' ' + botOptions.botData.lastName + ' -> ' + botOptions.botData.userReward + ' ' + botOptions.botData.tokenName + ' -> ' + data.receiverData.attrs.senderFirstName,
                            'message',
                            true,
                            botOptions.botData.userReward,
                        );

                        getQuestionsInGroup(currentButtonType).then(questions => {
                            if(answerId === questions.length){
                                let buttons = [
                                    {
                                        name: 'Edit your in-take form',
                                        value: 'Edit your in-take form'
                                    }
                                ]
                                return sendMessage(
                                    data,
                                    messages.bot.answeredAllQuestions+'\n\n'+messages.bot.tnxYouVerify+questions.length+' '+botOptions.botData.tokenName+'!',
                                    'message',
                                    false,
                                    0,
                                    buttons
                                );
                            }
                            return questionHandler(data);

                        }).catch(error => {
                            console.log('Error | getListQuestions: ', error);
                            return sendMessage(
                                data,
                                messages.errors.requestError,
                                'message',
                                false,
                                0,
                            );
                        });


                    }).catch((error) => {
                        console.log('transferToken ERROR', error)
                        return sendMessage(
                            data,
                            messages.errors.payment.transferTokenError,
                            'message',
                            false,
                            0,
                        );
                    })
                }).catch(error => {
                    console.log('Error | answerHandler: ', error);
                    return sendMessage(
                        data,
                        messages.errors.requestError,
                        'message',
                        false,
                        0,
                    );
                })
            }
        }).catch((error) => {
            console.log('getQuestion Error: ', error)
        });
    }).catch(error => {
        console.log('Error | answerHandler: ', error);
        return sendMessage(
            data,
            messages.errors.requestError,
            'message',
            false,
            0,
        );
    });
}