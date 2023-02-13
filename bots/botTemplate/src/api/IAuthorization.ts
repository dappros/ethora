export interface IAuthorization {
    token: string;
    refreshToken: string;
    data: IAuthData;
}

export interface IAuthData {
    _id: string;
    botJID: string;
    appId: string;
    xmppPassword: string;
    walletAddress: string;
    username: string;
    firstName: string;
    lastName: string;
    photo: string;
    emails?: Array<string>;
    updatedAt: string;
    isUserDataEncrypted: boolean;
}