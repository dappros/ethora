let botOptions = {
    serverType: 'prod',
    allowedRooms: [
        {
            name: 'hliuch',
            conferenceAddress: '@chat.jabb.im'
        },
        {
            name: 'f6b35114579afc1cb5dbdf5f19f8dac8971a90507ea06083932f04c50f26f1c5',
            conferenceAddress: '@conference.dev.dxmpp.com'
        }
    ],
    botData: {
        firstName: 'Hut hut',
        lastName: 'Bot',
        walletAddress: '',
        photoURL: 'https://cdn-icons-png.flaticon.com/512/7450/7450534.png',
        senderWalletAddress: '0xdC997088C118402C8919eDfC8Bfc3f8DD43CE33c',
        tokenName: 'Hablar Coin',
        tokenSymbol: 'HAB',
        storeFee: 1,
        collectFee: 3
    },
    apiUrl: 'https://app-dev.dappros.com/v1/'
}

export default botOptions;