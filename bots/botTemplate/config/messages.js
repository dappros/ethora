const messages = () => {
    return {
        general: {
            welcomeMessage: 'Sample bot launched!',
        },
        exampleBotMessage: {
            helloPresence: 'Hello! \n\nThis is a message of presence',
            leaveMessage: 'You have exited to the main menu, all steps have been updated.',
            helpMessage: 'Hello!\n\nI\'m a simple bot template that you can create!'
        },
        testMessage: 'test answer',
        errors: {
            requestError: 'An error occurred during the request, please try again later.',
        },
    }
}

export default messages();