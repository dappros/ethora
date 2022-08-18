import axios from "axios";
import botOptions from "./config/config.js";

export let loginData = [];

export const botLogin = async (username, password) => {
    try {
        const request = await axios.post(botOptions.apiUrl + 'users/login', {
            username: username,
            password: password
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: process.env.TOKEN,
            },
        });
        loginData = request.data;
        return true;
    } catch (error) {
        return error.data;
    }
}

const requestTransferToken = async (tokenId, tokenName, amount, wallet) => {
    try {
        let test = await axios.post(botOptions.apiUrl + 'tokens/transfer', {
            tokenId: tokenId,
            tokenName: botOptions.botData.sendTokenName,
            amount: amount,
            toWallet: wallet
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: loginData.token,
            },
        });
        console.log('requestTransferToken Success: ', test)
        return true;
    } catch (error){
        console.log('====> request TransferToken Error: ', error.response.status)
        refreshToken().then(response => {
            console.log('==================>', response.data)
            requestTransferToken(tokenId, tokenName, amount, wallet).then(responseTransfer => {
                console.log('Request transfer after refresh', loginData.token)
                return responseTransfer;
            }).catch(error => {
                console.log('transferToken after refresh Error: ', error.data);
                return false;
            });
        }).catch(error =>{
            console.log('refreshToken Error: ', error.data);
            return false;
        });


        return error;
    }
}

export const mintNft = async (contractAddress, slot, amount, walletAddress) => {
    try {
        let test = await axios.post(botOptions.apiUrl + 'tokens/items/nfmt/mint', {
            contractAddress: contractAddress,
            slot: slot,
            amount: amount,
            target: walletAddress
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: loginData.token,
            },
        });
        console.log('mintNft Success: ', test.data)
        return true;
    } catch (error){
        console.log('====> request mintNft Error: ', error.response.status)
        refreshToken().then(response => {
            console.log('==================>', response.data)
            mintNft(tokenId, tokenName, amount, wallet).then(responseTransfer => {
                console.log('Request transfer after refresh', loginData.token)
                return responseTransfer;
            }).catch(error => {
                console.log('transferToken after refresh Error: ', error.data);
                return false;
            });
        }).catch(error =>{
            console.log('refreshToken Error: ', error.data);
            return false;
        });


        return error;
    }
}

export const transferToken = async (tokenId, tokenName, amount, wallet) => {
        requestTransferToken(tokenId, tokenName, amount, wallet).then(response => {
            console.log('TRANSFER ===================', response)
        }).catch(error => {
            console.log('transferToken Error: ', error.response);

        })
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
        loginData.token = request.data.token;
        loginData.refreshToken = request.data.refreshToken;
        return true;
    } catch (error) {
        console.log('refreshToken Error: ', error);
        return false;
    }
}

export const getMintItemData = async (walletAddress) => {
    try {
        let itemData = await axios.get(botOptions.apiUrl + 'tokens/get/'+walletAddress);
        return itemData.data.results;
    }catch (error){
        console.log('Error getMintItemData: ', error)
    }
}

const handlerRefreshToken = (amount, wallet) => {
    console.log('=> Token is outdated, launch refreshToken')
    refreshToken().then(response => {
        console.log('==================>', response)
        if (response) {
            // return transferToken(amount, wallet);
            return true;
        }
        return false;
    }).catch(() => {
        return false;
    });
}