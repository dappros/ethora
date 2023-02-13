import axios from "axios";
import {IAuthorization} from "./IAuthorization";
import {IApplicationAPI} from "./IApplicationAPI";
import {APIDOMAIN, BOTIMG, TOKENJWT} from "../Config";

export default class ApplicationAPI implements IApplicationAPI {
    authData: IAuthorization;
    private http: any;
    baseURL: string;
    private readonly tokenJWT: string;

    constructor() {
        this.tokenJWT = TOKENJWT;
        this.baseURL = APIDOMAIN;

        this.http = axios.create({
            baseURL: this.baseURL
        });

        this.http.interceptors.response.use(undefined, (error: any) => {
            return this._errorHandler(error)
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
                    _id: String(request.data._id),
                    botJID: ApplicationAPI._getJID(String(request.data.user.defaultWallet.walletAddress)),
                    appId: String(request.data.appId),
                    xmppPassword: String(request.data.xmppPassword),
                    walletAddress: String(request.data.user.defaultWallet.walletAddress),
                    username: String(request.data.username),
                    firstName: String(request.data.firstName),
                    lastName: String(request.data.lastName),
                    photo: BOTIMG,
                    emails: Array.isArray(request.data.emails) ? request.data.emails : [],
                    updatedAt: String(request.data.updatedAt),
                    isUserDataEncrypted: request.data.isUserDataEncrypted,
                }
            };
            return this.authData;
        } catch (error) {
            return error.data;
        }
    }

    _errorHandler(error: any) {
        if (!error.response || error.response.status !== 401) {
            return Promise.reject(error);
        }

        if (error.request.path === '/v1/users/login/refresh') {
            return Promise.reject(error);
        }

        const request = error.config;

        return this._refreshToken()
            .then(() => {
                return new Promise((resolve) => {
                    'sendig request after refresh';
                    request.headers['Authorization'] = this.authData.token;
                    resolve(this.http(request));
                });
            })
            .catch((error) => {
                console.log('Refresh token rejected.');
                return Promise.reject(error);
            });
    }

    _refreshToken() {
        return new Promise((resolve, reject) => {
            this.http.post('/users/login/refresh', {}, {headers: {'Authorization': this.authData.refreshToken}})
                .then((response: any) => {
                    this.authData.token = response.data.token;
                    this.authData.refreshToken = response.data.refreshToken;
                    resolve(response)
                })
                .catch((error: any) => {
                    reject(error)
                })
        });
    }
}