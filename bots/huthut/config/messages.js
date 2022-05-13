const messages = () => {
    return {
        general: {
            welcomeMessage: 'Hey! Hut Hut Bot launched',
            botStatusOnline: 'Hut hut Online',
            toTheBeginning: 'You leave hastily, hoping to never see the scary Hut again.'
        },
        testMessage: 'Test response',
        help: {
            whereToBegin: 'Don\'t know what to write? You can ask the hut to turn its back to the forest :)',
            secondStep: 'Well, now you can ask the hut to turn front to you;)'
        },
        visitingHut: {
            firstGreeting: 'Screeches and creaks are heard from the woods as you approach what looks like a hut on chicken legs. The hut seems to be on alert waiting for what you have to say.',
            openingHut: 'Further blood-curdling screeches and creaks are heard as the hideous Hut spins around. It finally comes to a stop with its door towards you.\n Will you dare entering? (enter the correct number)\n1) Enter and store an Item - 10 Coins\n2) Enter and search for Items - 25 Coins\n3) Leave',
            storeItemSuccess: 'Item added successfully',
            searchItemsSuccess: 'Item search successfully',
        },
        errors: {
            wrongNumber: 'Oops, you entered text or wrong number, please try again'
        }
    };
}

export default messages();