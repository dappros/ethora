import botOptions from "./config.js";

const messages = () => {
    return {
        general: {
            welcomeMessage: 'Hey! Hut Hut Bot launched',
            botStatusOnline: 'Hut hut Online',
            toTheBeginning: 'You leave hastily, hoping to never see the scary Hut again.'
        },
        testMessage: 'Send 1 coin to this message to continue',
        help: {
            whereToBegin: 'Don\'t know what to write? You can ask the hut to turn its back to the forest :)',
            secondStep: 'Well, now you can ask the hut to turn front to you;)'
        },
        visitingHut: {
            firstGreeting: 'Screeches and creaks are heard from the woods as you approach what looks like a hut on chicken legs. The hut seems to be on alert waiting for what you have to say.',
            openingHut: 'Further blood-curdling screeches and creaks are heard as the hideous Hut spins around. It finally comes to a stop with its door towards you.\n Will you dare entering? (enter the correct number)\n1) Enter and store an Item - '+botOptions.botData.storeFee+' Coins\n2) Enter and search for Items - '+botOptions.botData.collectFee+' Coins\n3) Leave',
            storeItemSuccess: 'Coins received, please send the item to the hut',
            searchItemsSuccess: 'Item search successfully',
            choseItemPlacement: 'You decide to place an item, for this transfer '+botOptions.botData.storeFee +' coins to the bot',
            choseReceiveItem: 'You decided to take the item, for this transfer '+botOptions.botData.collectFee+' coins to the bot',
            randomlyGotItem: 'You randomly got an item ',
            noItemsInBot: 'Unfortunately there are no items in the hut (',
            toPlaceItemNeed: 'To place an item you need '+botOptions.botData.storeFee +' coins',
            toGetItemNeed: 'To get an item you need '+botOptions.botData.collectFee +' coins'
        },
        errors: {
            wrongNumber: 'Oops, you entered text or wrong number, please try again',
            payment: {
                paymentError: 'Please transfer the coin to the message',
                getRandomItemError: 'Sorry, there was an error getting the items list, that\'s awful',
                transferTokenError: 'An error occurred while transferring the token',
                wrongAmount: 'You have not sent enough coins, please send the required amount'
            }
        }
    };
}

export default messages();