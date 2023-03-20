import {IAuthData, IAuthorization} from "./IAuthorization";

export interface IWalletBalance {
    success: boolean;
    balance: {
        tokenName: string;
        tokenSymbol: string;
        balance: string;
        contractAddress: string;
    }[];
    defaultToken: string;
    nfmtContracts: any;
}


export interface IApplicationAPI{
    userAuthorization(username: string, password: string): Promise<IAuthorization>;
    userRegistration(username: string, password: string): Promise<IAuthData>;
    getBalance(): Promise<any>;
}