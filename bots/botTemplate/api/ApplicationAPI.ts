import axios from "axios";
import {IAuthorization} from "./IAuthorization";
import {IApplicationAPI} from "./IApplicationAPI";

export default class ApplicationAPI implements IApplicationAPI {
    authData: IAuthorization;
    http: any;
    baseURL: string;
    tokenJWT: string;

    constructor(tokenJWT: string, baseURL: string) {
        this.tokenJWT = tokenJWT;
        this.baseURL = baseURL;

        this.http = axios.create({
            baseURL: this.baseURL
        });

        this.http.interceptors.response.use(undefined, error => {
            return this._errorHandler(error)
        });
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
                .then(response => {
                    this.authData.token = response.data.token;
                    this.authData.refreshToken = response.data.refreshToken;
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        });
    }
}
