let botOptions = {
    botData: {
        firstName: process.env.FIRST_NAME ? process.env.FIRST_NAME : process.env.APP_USERNAME,
        lastName: process.env.LAST_NAME ? process.env.LAST_NAME : 'Bot',
        photoURL: process.env.PHOTO_URL ? process.env.PHOTO_URL : 'https://ethora.com/resources/assets/wikiethora.png',
        tokenName: process.env.TOKEN_NAME ? process.env.TOKEN_NAME : 'Dappros Platform Token',
        tokenSymbol: 'DPT',
        sendTokenName: 'Dappros Platform Token',
        waitingAfterPresence: process.env.PRESENCE_WAIT && process.env.PRESENCE_WAIT > 0 ? process.env.PRESENCE_WAIT : 5
    },
    apiUrl: process.env.API_URL
}

export default botOptions;