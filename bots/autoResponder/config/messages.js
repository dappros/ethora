const messages = () => {
    return {
        general: {
            welcomeMessage: 'Sample bot launched!',
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
        didYouWantToLearnMore: 'Hi, I\'m assisting here.\n\nDid you want to learn more about our products and services or just wanted to chat?',
        informationAboutCompany: 'Information about the products and services of the company.',
        youHaveAChat: 'Thank you for looking through the information!\n\nEnjoy using Ethora!'
    }
}

export default messages();