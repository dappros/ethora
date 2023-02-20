export interface IConfigData {
    isProduction: boolean;
    baseDomain: string;
    botName: string;
    conferenceDomain: string;
    domain: string;
    service: string;
    botImg: string;
    apiDomain: string;
    tokenJWT: string;
    connectionRooms: string[];
}

export interface IConfig {
    init(botName: string, tokenJWT: string, isProduction?: boolean, botImg?: string): void;

    getData(): IConfigData;
}