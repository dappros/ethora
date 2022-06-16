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
            secondStep: 'Well, now you can ask the hut to turn front to you;)'
        },
        errors: {
        }
    };
}

export default messages();