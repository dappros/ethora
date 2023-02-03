const messages = () => {
    return {
        general: {
            welcomeMessage: 'Hey! I will be glad to answer all your questions.',
        },
        exampleBotMessage: {
            helloPresence: 'Hello! \n\nThis is a message of presence',
            leaveMessage: 'You have exited to the main menu, all steps have been updated.',
            helpMessage: 'Hello!\n\nI\'m a simple bot template that you can create!',
            tnxForTransaction: 'Thanks for your coins!'
        },
        testMessage: 'test answer',
        errors: {
            requestError: 'An error occurred during the request, please try again later.',
        },
    }
}

export default messages();