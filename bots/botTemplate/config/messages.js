const messages = () => {
    return {
        general: {
            welcomeMessage: 'Sample bot launched!',
            youHaveQuestions: 'You have an unfinished in-take form to complete.',
            botStatusOnline: 'Questionnaire bot Online',
            toTheBeginning: 'You have exited to the main menu.'
        },
        exampleBotMessage:{
          helloPresence: 'Hello! \n\nThis is a message of presence'
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
            },
            answerNumError: 'Error, you entered the wrong date, please try again',
            editAnswerError: 'An error occurred while saving the response'
        },
        merchantBot: {
            startMessages: [
                'Hi, I’m the Merchant and will help you to get some unique Items in no time!\n\nBest prices this part of the galaxy!\n\nLet me get some details for you.',
            ],
            chooseDetails: 'Now, the Collection is called and these are the details:'
        },

        bot: {
            answeredAllQuestions: 'That’s all, thank you for your patience!\nShall we verify the inputs?',
            answerSaved: 'Your answer has been successfully saved!',
            tnxForTransaction: 'Thank you very much for your donation )',
            editAnswerNum: 'Enter your answer number',
            sendOnlyNumbers: 'Please enter only numbers',
            sendYouAnswer: 'Enter your new answer',
            tnxYouVerify: 'Thank you for verification. You have ',
            helloMessageNewUser: 'Hi! Looks like you’re new to the system.\n\nFirst, we should fill out the In-take form with you.\n\nThere are 27 mandatory questions plus some optional questions.\n\nIt takes between 5 and 10 minutes to fill out the mandatory part.',
            helloMessageWithoutIntake: 'Hi! Looks like you have not finished your in-take form.\n\nSimply tap the “Complete the In-take form” button below in order to finalize this.',
            helloMessage: 'How can I help you today?',
            helloMessageButtons: [
                {
                    name: 'Go ahead - fill the In-take form',
                    value: 'In-take form'
                },
                {
                    name: 'Medications',
                    value: 'Medications'
                },
                {
                    name: 'Allergies',
                    value: 'Allergies'
                },
                {
                    name: 'Medical reports',
                    value: 'Medical reports',
                    notDisplayedValue: "MedicalReports"
                }
            ],
            helloMessageABtn: 'Go ahead - fill the In-take form',
            helloMessageBBtn: 'Complete the In-take form',
            helloMessageCBtn: 'My profile (In-take form)',
            showExisting: 'I’m showing entries 1-5 out of total 10 entries as buttons below.',
            buttons: {
                Allergies: [
                    {
                        "name": "Review existing allergies",
                        "value": "Review existing allergies"
                    },
                    {
                        "name": "Add a new allergy",
                        "value": "Add a new allergy"
                    },
                    {
                        "name": "🚪 Go back to main menu",
                        "value": "leave"
                    }
                ],
                Medications: [
                    {
                        "name": "Review existing medications",
                        "value": "Review existing medications"
                    },
                    {
                        "name": "Add a new medication",
                        "value": "Add a new medication"
                    },
                    {
                        "name": "🚪 Go back to main menu",
                        "value": "leave"
                    }
                ],
                MedicalReports: [
                    {
                        "name": "Add a new report",
                        "value": "Add a new report"
                    },
                    {
                        "name": "Review all existing reports",
                        "value": "Review all existing reports"
                    },
                    {
                        "name": "Search by specific doctor",
                        "value": "Search by specific doctor",
                        "notDisplayedValue": "Doctor:"
                    },
                    {
                        "name": "Browse by date starting from most recent",
                        "value": "Browse by date starting from most recent",
                        "notDisplayedValue": "Date:"
                    },
                    {
                        "name": "Search by type",
                        "value": "Search by type",
                        "notDisplayedValue": "Type:"
                    },
                    {
                        "name": "Search by kind",
                        "value": "Search by kind",
                        "notDisplayedValue": "Kind:"
                    },
                    {
                        "name": "🚪 Go back to main menu",
                        "value": "leave"
                    }
                ],
                buttonsExisting: [
                    {
                        "name": "Show me more entries",
                        "value": "Show me more entries"
                    },
                    {
                        "name": "🚪 Go back to main menu",
                        "value": "leave"
                    }
                ],
                oneAnswerButtons: [
                    {
                        "name": "Delete",
                        "value": "Delete"
                    },
                    {
                        "name": "🚪 Cancel",
                        "value": "leave"
                    }
                ]
            },
            youDontHaveAnswer: 'You don\'t have answers yet',
            youAlreadyLooked: 'You have already looked at all your answers',
            wrongQuestion: 'Wrong text entered',
            deletedSuccessfully: "Deleted successfully"


        }
    };
}

export default messages();