import {IAuthData, IAuthorization} from "./IAuthorization";

export interface IApplicationAPI{
    userAuthorization(username: string, password: string): Promise<IAuthorization>;
    userRegistration(username: string, password: string): Promise<IAuthData>;
}