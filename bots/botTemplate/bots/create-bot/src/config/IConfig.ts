export interface IConfigData {
    username: string;
    password: string;
    token: string;
    avatar: string;
    rooms: string[];
}

export interface IBotInit {
    username: string;
    password: string;
    tokenJWT: string;
    botName: string;
    useTyping: boolean;
    connectionRooms: string[];
}

export interface IConfig {
    get getConfigData(): IConfigData;
    get getBotInitData(): IBotInit;
}