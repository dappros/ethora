const messages = () => {
    return {
        general: {
            welcomeMessage: 'Raffle bot launched!',
        },
        exampleBotMessage: {
            helloPresence: 'Hello! I am the raffler',
            leaveMessage: 'You have exited to the main menu, all steps have been updated.',
            helpMessage: 'Hello!\n\nI\'m a simple bot template that you can create!',
            tnxForTransaction: 'Thanks for your coins!',
            userLimit: 'Hello, this message confirms that the number of users in the room is correct.',
        },
        testMessage: 'test answer',
        errors: {
            requestError: 'An error occurred during the request, please try again later.',
        },
        raffleBotReplies: {
            initiateBot: 'Do you want to raffle? This works simple:\n\n send me an Item and specify the duration.\n All users who write something into chat before the timer runs out will participate in the raffle.\n\n I will randomly pick the winner and send the Item to them! \n\nOne more thing - please transfer 7 Coins towards my costs and we will proceed.',
            durationToParticipate: 'Thank you! Now, what should be the duration?',
            sendPrizeItem: 'Perfect, just send me the prize item now and we are good to go!',
            durationCancel: 'Raffle was cancelled, try again next time',
            raffleRegistrationOn: 'Thank you. I am pleased to announce that the raffle registration is now on!',
            countAsParticipant: 'all users who write a message during next 10 minutes will all be counted as participants!',
            remindRaffle: 'To remind everyone, the raffle is on and the prize is...',
            beCountedIn: 'Just write a message to be counted in!',
            oneMinuteLeft: 'There is just 1 minute left until the winner of the raffle is announced!\n You can still participate by writing any message here. Quick!',
            raffleComplete: 'TA-DA!!! The raffle is now officially complete!',
            winnerIs: 'And the winner is...',
            congratsPrize: 'Congratulations, , here is your prize!',
        },
        menu: {
            mainMenu: [
                {
                name: '3 Minutes',
                value: '3 Minutes',
                notDisplayedValue: "00:03:00"
                },
                {
                    name: '5 Minutes',
                    value: '5 Minutes',
                    notDisplayedValue: "00:05:00"
                },
                {
                    name: '10 Minutes',
                    value: '10 Minutes',
                    notDisplayedValue: "00:10:00"
                },
                {
                    name: '30 Minutes',
                    value: '30 Minutes',
                    notDisplayedValue: "00:30:00"
                },
                {
                    name: '1 Hour',
                    value: '1 Hour',
                    notDisplayedValue: "01:00:00"
                },
                {
                    name: '1 Day',
                    value: '1 Day',
                    notDisplayedValue: "1d"
                },
                {
                    name: 'Cancel',
                    value: 'Cancel'
                }
            ]
        }
    }
}

export default messages();