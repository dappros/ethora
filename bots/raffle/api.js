import axios from "axios";
import botOptions from "./config/config.js";

export let loginData = [];

const http = axios.create({
    baseURL: botOptions.apiUrl
});

export const botLogin = async (username, password) => {
    try {
        const request = await http.post('users/login', {
            username: username,
            password: password
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: process.env.TOKEN,
            },
        });
        loginData = request.data;
        console.log('=> Bot address: ', loginData.user.defaultWallet.walletAddress)
        return true;
    } catch (error) {
        return error.data;
    }
}

const refresh = () => {
    return new Promise((resolve, reject) => {
        http.post('/users/login/refresh', {}, {headers: {'Authorization': loginData.refreshToken}})
            .then(response => {
                loginData.token = response.data.token;
                loginData.refreshToken = response.data.refreshToken;
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
    })
}

http.interceptors.response.use(undefined, error => {
    if (!error.response || error.response.status !== 401) {
        return Promise.reject(error)
    }

    if (error.request.path === '/v1/users/login/refresh') {
        return Promise.reject(error)
    }

    const request = error.config

    return refresh()
        .then(() => {
            return new Promise((resolve) => {
                'sendig request after refresh'
                request.headers['Authorization'] = loginData.token
                resolve(http(request))
            })
        })
        .catch((error) => {
            console.log('Refresh reject')
            return Promise.reject(error)
        })
})

export const transferToken = async (tokenId, tokenName, amount, wallet) => {
    try {
        let test = await http.post('tokens/transfer', {
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
        console.log('requestTransferToken Success: ', test.data)
        return true;
    } catch (error) {
        JSON.stringify(error)
        throw error;
    }
}

export const transferItem = async (nftId, receiverWallet, amount) => {
    try {
        let request = await http.post('tokens/transfer/items', {
            nftId,
            receiverWallet,
            amount
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: loginData.token,
            },
        });
        console.log('requestTransferItem Success: ', request.data)
        return true;
    } catch (error) {
        JSON.stringify(error)
        throw error;
    }
}

export const getBalance = async () => {
    try {
        let request = await http.get('wallets/balance', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: loginData.token,
            },
        });
        return request.data;
    } catch (error) {
        JSON.stringify(error)
        throw error;
    }
}

export const mintNft = async (contractAddress, slot, amount, walletAddress) => {
    try {
        let test = await http.post('tokens/items/nfmt/mint', {
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
    } catch (error) {
        JSON.stringify(error)
        throw error;
    }
}

export const getMintItemData = async (walletAddress) => {
    try {
        let itemData = await http.get('tokens/get/' + walletAddress);
        return itemData.data.results;
    } catch (error) {
        console.log('Error getMintItemData: ', error)
    }
}

export const saveApiData = async (data) => {
    try {
        let result = await http.post('data', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: loginData.token,
            },
        });
        console.log('saveData Success: ', result.data)
        return result;
    } catch (error) {
        JSON.stringify(error)
        throw error;
    }
}

export const getFilteredApiData = async (params) => {
    try {
        let result = await http.get('data', {params}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: loginData.token,
            },
        });
        return result.data;
    } catch (error) {
        JSON.stringify(error)
        throw error;
    }
}

export const deleteApiData = async (id) => {
    try {
        let result = await http.delete('data/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: loginData.token,
            },
        });
        return result.data;
    } catch (error) {
        JSON.stringify(error)
        throw error;
    }
}

export const updateApiData = async (id, data) => {
    try {
        let result = await http.patch('data/' + id, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: loginData.token,
            },
        });
        return result.data;
    } catch (error) {
        JSON.stringify(error)
        throw error;
    }
}