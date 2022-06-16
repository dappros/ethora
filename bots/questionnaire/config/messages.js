import botOptions from "./config.js";

const messages = () => {
    return {
        general: {
            welcomeMessage: 'Hey! Questionnaire  Bot launched',
            botStatusOnline: 'Questionnaire bot Online',
            toTheBeginning: 'You have exited to the main menu.'
        },
        testMessage: 'test answer',
        help: {
            whereToBegin: 'Don\'t know what to do? Just write "bot" in the chat, after that I will ask you a question and to answer it, write the keyword "bot" then your answer',
            secondStep: 'For an answer, write the first word "bot" and then your answer'
        },
        errors: {
            requestError: 'An error occurred during the request, please try again later.',
            payment: {
                paymentError: 'Please transfer the coin to the message',
                getRandomItemError: 'Sorry, there was an error getting the items list, that\'s awful',
                transferTokenError: 'An error occurred while transferring the token',
                wrongAmount: 'You have not sent enough coins, please send the required amount',
                userPaymentVerifyErr: 'An error occurred while checking user payment'
            }
        },
        bot: {
            answeredAllQuestions: 'You have already answered all the questions, thanks!',
            answerSaved: 'Your answer has been successfully saved! Thank you I give you a reward'
        }
    };
}

export default messages();