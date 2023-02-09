import {IAuthorization} from "./IAuthorization";

export interface IApplicationAPI{
    _errorHandler(error: any): any;
    _refreshToken(): any;
    userAuthorization(username: string, password: string): Promise<IAuthorization>;
}