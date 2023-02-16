import {IAuthorization} from "./IAuthorization";

export interface IApplicationAPI{
    _errorHandler(error: any, authData: IAuthorization): any;
    _refreshToken(authData: IAuthorization): any;
    userAuthorization(username: string, password: string): Promise<IAuthorization>;
}