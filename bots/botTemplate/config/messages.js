const messages = () => {
    return {
        general: {
            welcomeMessage: 'Sample bot launched!',
        },
        exampleBotMessage: {
            helloPresence: 'Hello! \n\nThis is a message of presence',
            leaveMessage: 'You have exited to the main menu, all steps have been updated.',
            helpMessage: 'Hello!\n\nI\'m a simple bot template that you can create!',
            tnxForTransaction: 'Thanks for your coins!',
            userLimit: 'Hello, this message confirms that the number of users in the room is correct.'
        },
        testMessage: 'test answer',
        errors: {
            requestError: 'An error occurred during the request, please try again later.',
        },
    }
}

export default messages();