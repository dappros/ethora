import {sendMessage, userSteps} from "../actions.js";
import messages from "../config/messages.js";
import {getListAnswers, setAnswer} from "../controllers/answers.js";
import {transferToken} from "../api.js";
import botOptions from "../config/config.js";
import {questionHandler} from "./question.js";

export const answerHandler = (data) => {
    console.log('=> answerHandler | Message received from ', data.receiver, data.message);
    const userMessage = data.message.split(' ').slice(1).join(' ');
    getListAnswers(data.receiver).then(result => {
        const answerId = result.length+1;
        setAnswer(answerId, userMessage, data.receiver).then(() => {
            sendMessage(
                data,
                messages.bot.answerSaved,
                'message',
                false,
                0,
            );
            transferToken(botOptions.botData.tokenSymbol, botOptions.botData.tokenName, botOptions.botData.userReward, data.receiverData.attrs.senderWalletAddress).then(response => {
                console.log('=> Transfer success', response.data);
                userSteps('setStep', data.receiver, 1);
                sendMessage(
                    data,
                    botOptions.botData.firstName + ' ' + botOptions.botData.lastName + ' -> ' + botOptions.botData.userReward + ' ' + botOptions.botData.tokenName + ' -> ' + data.receiverData.attrs.senderFirstName,
                    'message',
                    true,
                    botOptions.botData.userReward,
                );
                return questionHandler(data);
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