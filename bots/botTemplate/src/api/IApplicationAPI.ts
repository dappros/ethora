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

export interface ITransaction {
    hashes: any[];
    _id: string;
    tokenId: string;
    from: string;
    to: string;
    tokenName: string;
    contractAddress: string;
    value: number;
    type: string;
    isCompleted: boolean;
    timestamp: string;
    senderFirstName: string;
    senderLastName: string;
    receiverFirstName: string;
    receiverLastName: string;
    senderBalance: string;
    receiverBalance: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    blockNumber: number;
    transactionHash: string;
    fromFirstName: string;
    fromLastName: string;
    toFirstName: string;
    toLastName: string;
}

export interface ITransactions {
    total: number;
    limit: number;
    offset: number;
    items: ITransaction[];
}

interface IDeployNFMT {
    type: string,
    name: string,
    description: string,
    owner: string,
    beneficiaries: string[],
    splitPercents: number[],
    costs: string[],
    attachmentId: string,
    maxSupplies: number[]
}

export interface IApplicationAPI {
    userAuthorization(email: string, password: string): Promise<IAuthorization>;
    userRegistration(email: string, password: string): Promise<IAuthData>;
    transferToken(amount: number, wallet: string): Promise<any>;
    getBalance(): Promise<any>;
    getTransactions(walletAddress: string): Promise<ITransactions>;
    deployNfmt(data: IDeployNFMT): Promise<any>;
}