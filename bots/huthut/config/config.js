let botOptions = {
    allowedRooms: [
        {
            name: 'hliuch',
            conferenceAddress: '@chat.jabb.im',
            type: 'PROD'
        },
        {
            name: 'f6b35114579afc1cb5dbdf5f19f8dac8971a90507ea06083932f04c50f26f1c5',
            conferenceAddress: '@conference.dev.dxmpp.com',
            type: 'PROD'
        },
        {
            name: '657d0762a27d3e00d809ff08022b98cf5914357c58da1706ca4441d32ba7b07f',
            conferenceAddress: '@conference.dev.dxmpp.com',
            type: 'DEV'
        }
    ],
    botData: {
        firstName: 'Hut hut',
        lastName: 'Bot',
        walletAddress: '',
        photoURL: 'https://cdn-icons-png.flaticon.com/512/7450/7450534.png',
        tokenName: 'Hablar Coin',
        tokenSymbol: 'HAB',
        storeFee: 1,
        collectFee: 3
    },
    apiUrl: 'https://app-dev.dappros.com/v1/'
}

export default botOptions;