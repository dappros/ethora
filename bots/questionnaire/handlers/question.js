import {sendMessage, userSteps} from "../actions.js";
import messages from "../config/messages.js";
import {getListAnswers} from "../controllers/answers.js";
import {getListQuestions} from "../controllers/questions.js";

export const questionHandler = (data) => {
    console.log('=> questionHandler | Message received from ', data.receiver, data.message);
    getListQuestions().then(result => {
        let questions = result;
        getListAnswers(data.xmpp.jid._local).then(result => {
            if(questions.length === result.length){
                return sendMessage(
                    data,
                    messages.bot.answeredAllQuestions,
                    'message',
                    false,
                    0,
                );
            }
            const lastAnswerIndex = result.length;
            userSteps('setStep', data.receiver, 2);
            return sendMessage(
                data,
                questions[lastAnswerIndex].question,
                'message',
                false,
                0,
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