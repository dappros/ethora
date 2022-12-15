import axios from "axios";
import botOptions from "./config/config.js";

export let loginData = [];

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