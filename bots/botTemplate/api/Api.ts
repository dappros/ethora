import axios from "axios";
import botOptions from "./config/config.js";

class Bot {
    loginData: any[];
    http: any;

    constructor() {
        this.loginData = [];
        this.http = axios.create({
            baseURL: botOptions.apiUrl
        });
    }

    async botLogin(username: string, password: string): Promise<boolean | any> {
        try {
            const request = await this.http.post('users/login', {
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: process.env.TOKEN,
                },
            });
            this.loginData = request.data;
            console.log('=> Bot address: ', this.loginData.user.defaultWallet.walletAddress)
            return true;
        } catch (error) {
            return error.data;
        }
    }

    refresh(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post('/users/login/refresh', {}, {headers: {'Authorization': this.loginData.refreshToken}})
                .then(response => {
                    this.loginData.token = response.data.token;
                    this.loginData.refreshToken = response.data.refreshToken;
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        });
    }

    handle401() {
        this.http.interceptors.response.use(undefined, error => {
            if (!error.response || error.response.status !== 401) {
                return Promise.reject(error);
            }

            if (error.request.path === '/v1/users/login/refresh') {
                return Promise.reject(error);
            }

            const request = error.config;

            return this.refresh()
                .then(() => {
                    return new Promise((resolve) => {
                        'sendig request after refresh';
                        request.headers['Authorization'] = this.loginData.token;
                        resolve(this.http(request));
                    });
                })
                .catch((error) => {
                    console.log('Refresh reject');
                    return Promise.reject(error);
                });
        });
    }

    async transferToken(tokenId: string, tokenName: string, amount: number, wallet: string): Promise<boolean | any> {
        try {
            let test = await this.http.post('tokens/transfer', {
                tokenId,
                tokenName: botOptions.botData.sendTokenName,
                amount,
                toWallet: wallet
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: this.loginData.token,
                },
            });
            console.log('requestTransferToken Success: ', test.data);
            return true;
        } catch (error) {
            JSON.stringify(error);
            throw error;
        }
    }
}

export default new Bot();
