import axios from "axios";
import botOptions from "./config/config.js";
import connectData from "./config/connect.js";

let loginData = [];

export const getRandomItem = async () => {
    try {
        const response = await axios.get(botOptions.apiUrl + 'wallets/balance/' + connectData.walletAddress);
        const nftItemList = response.data.balance.filter(data => data.tokenType === 'NFT' && data.balance > 0);
        if (nftItemList.length > 0) {
            return nftItemList[Math.floor(Math.random() * nftItemList.length)];
        } else {
            return false;
        }
    } catch (error) {
        console.log('getRandomItem Error: ', error.data);
        return false;
    }
}

export const botLogin = async (username, password) => {
    try {
        const request = await axios.post(botOptions.apiUrl + 'users/login', {
            username: username,
            password: password
        });
        loginData = request.data;
        return true;
    } catch (error) {
        return error.data;
    }
}

export const transferToken = async (tokenId, tokenName, amount, wallet) => {
    try {
        return await axios.post(botOptions.apiUrl + 'tokens/transfer', {
            tokenId: tokenId,
            tokenName: tokenName,
            amount: amount,
            toWallet: wallet
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: loginData.token,
            },
        });
    } catch (error) {
        console.log('transferToken Error: ', error.data);
        return error.data === 'Unauthorized' ? handlerRefreshToken(amount, wallet) : error.data;
    }
}

export const transferNft = async (nftId, wallet, amount) => {
    try {
        return await axios.post(botOptions.apiUrl + 'tokens/transfer/items', {
            nftId: nftId,
            receiverWallet: wallet,
            amount: amount,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: loginData.token,
            },
        });
    } catch (error) {
        console.log('transferNft Error: ', error.data);
        return error.data === 'Unauthorized' ? handlerRefreshToken(amount, wallet) : error.data;
    }
}

const refreshToken = async () => {
    if (loginData.length <= 0) {
        console.log('=> Bot not logged in')
        return false;
    }

    try {
        const request = await axios.post(botOptions.apiUrl + 'users/login/refresh', {}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: loginData.refreshToken,
            },
        });
        loginData = request.data;
        return true;
    } catch (error) {
        console.log('refreshToken Error: ', error.data);
        return error.data;
    }
}

const handlerRefreshToken = (amount, wallet) => {
    console.log('=> Token is outdated, launch refreshToken')
    refreshToken().then(response => {
        if (!response) {
            return false;
        }
        return transferToken(amount, wallet);
    }).catch(() => {
        return false;
    });
}

export const userPaymentVerify = async (data, amount) => {
    try {
        const request = await axios.get(botOptions.apiUrl + 'explorer/transactions/?limit=1&offset=0&walletAddress=' + data.receiverData.attrs.senderWalletAddress);
        let checkDate = (new Date() - new Date(request.data.items[0].timestamp)) / (60 * 60 * 24 * 1000);
        return !(checkDate > 1 || request.data.items[0].value !== amount || request.data.items[0].to !== connectData.walletAddress);
    } catch (error) {
        return error;
    }
}