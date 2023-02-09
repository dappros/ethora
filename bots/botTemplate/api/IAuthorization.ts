export interface IAuthorization {
    token: string;
    refreshToken: string;
    data: IAuthData;
}

export interface IAuthData {
    _id: string;
    appId: string;
    xmppPassword: string;
    walletAddress: string;
    username: string;
    firstName: string;
    lastName: string;
    emails: Array<string>;
    updatedAt: string;
    isUserDataEncrypted: boolean;
}