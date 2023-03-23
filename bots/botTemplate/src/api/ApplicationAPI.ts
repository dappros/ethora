import axios from "axios";
import {IAuthData, IAuthorization} from "./IAuthorization";
import {IApplicationAPI, IBalance, IWalletBalance} from "./IApplicationAPI";
import Config from "../config/Config";

export default class ApplicationAPI implements IApplicationAPI {
    authData: IAuthorization | undefined;
    baseURL: string;
    private readonly tokenJWT: string;
    private http: any;
    private tokenData: IBalance;

    constructor() {
        this.tokenJWT = Config.getData().tokenJWT;
        this.baseURL = Config.getData().apiDomain;

        this.http = axios.create({
            baseURL: this.baseURL
        });

        this.http.interceptors.response.use(undefined, (error: any) => {
            if (this.authData) {
                return this._errorHandler(error, this.authData)
            }
            return Promise.reject(error);
        });
    }

    static _getJID(wallet: string): string {
        return wallet.replace(/([A-Z])/g, '_$1').toLowerCase();
    }

    async userAuthorization(username: string, password: string): Promise<IAuthorization> {
        try {
            const request = await this.http.post('users/login', {
                username: username,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: this.tokenJWT,
                },
            });
            this.authData = {
                token: String(request.data.token),
                refreshToken: String(request.data.refreshToken),
                success: request.data.success,
                data: this._collectRequestData(request)
            };

            const balance = await this.getBalance();
            const currentBalanceData = this.getBalanceByDefaultToken(balance);

            if (currentBalanceData) {
                this.tokenData = currentBalanceData;
                !Config.getData().tokenName ? Config.setBotTokenName(currentBalanceData.tokenName) : null;
                return this.authData;
            }

            throw new Error('Default token not found.');
        } catch (error: any) {
            const errorData = error.response.data;
            if (errorData.errors[0].msg === "User do not found") {
                return errorData;
            }
            throw new Error(errorData);
        }
    }

    async userRegistration(username: string, password: string): Promise<IAuthData> {
        try {
            const request = await this.http.post('users', {
                username: username,
                password: password,
                firstName: username.charAt(0).toUpperCase() + username.slice(1),
                lastName: 'Bot'
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: this.tokenJWT,
                },
            });
            return this._collectRequestData(request);
        } catch (error: any) {
            const errorData = error.response.data;
            throw new Error(errorData);
        }
    }

    async getBalance(): Promise<IWalletBalance> {
        try {
            const request = await this.http.get('wallets/balance', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: this.authData.token,
                },
            });
            return request.data;
        } catch (error: any) {
            const errorData = error.response.data;
            throw new Error(errorData);
        }
    }

    async transferToken(amount: number, wallet: string): Promise<any> {
        try {
            const request = await this.http.post('tokens/transfer', {
                tokenId: this.tokenData.tokenSymbol,
                tokenName: this.tokenData.tokenName,
                amount: amount,
                toWallet: wallet
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: this.authData.token,
                },
            });
            return request.data;
        } catch (error) {
            JSON.stringify(error)
            throw error;
        }
    }

    getBalanceByDefaultToken(balance: IWalletBalance): IBalance {
        const balanceObj = balance.balance.find((item) => item.tokenName === balance.defaultToken);
        return balanceObj || null;
    }

    _collectRequestData(data: any): IAuthData {
        return {
            _id: String(data.data.user._id),
            botJID: ApplicationAPI._getJID(String(data.data.user.defaultWallet.walletAddress)),
            appId: String(data.data.user.appId),
            xmppPassword: String(data.data.user.xmppPassword),
            walletAddress: String(data.data.user.defaultWallet.walletAddress),
            username: String(data.data.user.username),
            firstName: String(data.data.user.firstName),
            lastName: String(data.data.user.lastName),
            photo: data.data.user.photo ? String(data.data.user.photo) : '',
            emails: Array.isArray(data.data.user.emails) ? data.data.user.emails : [],
            updatedAt: String(data.data.user.updatedAt),
            isUserDataEncrypted: data.data.app ? data.data.app.isUserDataEncrypted : true,
        };
    }

    _errorHandler(error: any, authData: IAuthorization) {
        if (!error.response || error.response.status !== 401) {
            return Promise.reject(error);
        }

        if (error.request.path === '/v1/users/login/refresh') {
            return Promise.reject(error);
        }

        const request = error.config;

        return this._refreshToken(authData)
            .then(() => {
                return new Promise((resolve) => {
                    'sendig request after refresh';
                    request.headers['Authorization'] = authData.token;
                    resolve(this.http(request));
                });
            })
            .catch((error) => {
                console.log('Refresh token rejected.');
                return Promise.reject(error);
            });
    }

    _refreshToken(authData: IAuthorization) {
        return new Promise((resolve, reject) => {
            this.http.post('/users/login/refresh', {}, {headers: {'Authorization': authData.refreshToken}})
                .then((response: any) => {
                    authData.token = response.data.token;
                    authData.refreshToken = response.data.refreshToken;
                    resolve(response)
                })
                .catch((error: any) => {
                    reject(error)
                })
        });
    }
}