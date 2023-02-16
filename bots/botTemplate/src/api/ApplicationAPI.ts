import axios from "axios";
import {IAuthorization} from "./IAuthorization";
import {IApplicationAPI} from "./IApplicationAPI";
import Config from "../config/Config";

export default class ApplicationAPI implements IApplicationAPI {
    authData: IAuthorization | undefined;
    private http: any;
    baseURL: string;
    private readonly tokenJWT: string;

    constructor() {
        this.tokenJWT = Config.getData().tokenJWT;
        this.baseURL = Config.getData().apiDomain;

        this.http = axios.create({
            baseURL: this.baseURL
        });

        this.http.interceptors.response.use(undefined, (error: any) => {
            if(this.authData){
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
                data: {
                    _id: String(request.data.user._id),
                    botJID: ApplicationAPI._getJID(String(request.data.user.defaultWallet.walletAddress)),
                    appId: String(request.data.user.appId),
                    xmppPassword: String(request.data.user.xmppPassword),
                    walletAddress: String(request.data.user.defaultWallet.walletAddress),
                    username: String(request.data.user.username),
                    firstName: String(request.data.user.firstName),
                    lastName: String(request.data.user.lastName),
                    photo: Config.getData().botImg,
                    emails: Array.isArray(request.data.user.emails) ? request.data.user.emails : [],
                    updatedAt: String(request.data.user.updatedAt),
                    isUserDataEncrypted: request.data.app.isUserDataEncrypted,
                }
            };
            return this.authData;
        } catch (error: any) {
            return error.data;
        }
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