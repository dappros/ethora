import {messageCheck, sendMessage, userData, userSteps} from "../actions.js";
import messages from "../config/messages.js";
import {getListAnswers, getListAnswersInGroup} from "../controllers/answers.js";
import {getListQuestions, getQuestionsInGroup} from "../controllers/questions.js";

export const questionHandler = (data) => {
    let currentButtonType = userData('getData', data.userJID, null, 'buttonType');

    getQuestionsInGroup(currentButtonType).then(result => {
        console.log('QUESTION LIST IN GROUP ===========> ', result)
        let questions = result;
        getListAnswersInGroup(data.receiverData.attrs.senderJID, currentButtonType).then(result => {
            if(result.length === 0){

            }
            if(questions.length === result.length && currentButtonType === 'In-take form'){

                const answers = [];
                for (const value of result) {
                    answers.push(value.question_id+') '+value.answer);
                }
                const answerList = answers.join('\n');
                const buttons = [
                    {
                        name: '✏ Edit answer',
                        value: 'Edit answer'
                    },
                    {
                        name: '🚪 Leave',
                        value: 'leave'
                    }
                ]

                return sendMessage(
                    data,
                    messageCheck(data.message, 'Edit your in-take form') ? '\n'+answerList : messages.bot.answeredAllQuestions+'\n'+answerList,
                    'message',
                    false,
                    0,
                    buttons
                );
            }
            const lastAnswerIndex = result.length;
            userSteps('setStep', data.receiverData.attrs.senderJID, 2);

            let questionCounter = ' ('+questions[lastAnswerIndex].question_id+'/'+questions.length+')';

            return sendMessage(
                data,
                questions[lastAnswerIndex].question+questionCounter,
                'message',
                false,
                0,
                questions[lastAnswerIndex].buttons ? questions[lastAnswerIndex].buttons : null,
            );
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
}