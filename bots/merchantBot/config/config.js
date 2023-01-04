let botOptions = {
    botData: {
        firstName: 'Merchant',
        lastName: 'Bot',
        photoURL: 'https://cdn-icons.flaticon.com/png/512/5836/premium/5836743.png?token=exp=1660657047~hmac=cdeea9d95a270bafab4b78a3e1d7a553',
        tokenName: 'Dappros Platform Token',
        tokenSymbol: 'DPT',
        sendTokenName: 'Dappros Platform Token',
        userReward: 1,
        waitingAfterPresence: 10 /* minutes */
    },
    apiUrl: process.env.API_URL
}

export default botOptions;