import {IAuthData, IAuthorization} from "./IAuthorization";

export interface IBalance {
    tokenName: string;
    tokenSymbol: string;
    balance: string;
    contractAddress: string;
}

export interface IWalletBalance {
    success: boolean;
    balance: IBalance[];
    defaultToken: string;
    nfmtContracts: any;
}


export interface IApplicationAPI {
    userAuthorization(username: string, password: string): Promise<IAuthorization>;
    userRegistration(username: string, password: string): Promise<IAuthData>;
    getBalance(): Promise<any>;
}