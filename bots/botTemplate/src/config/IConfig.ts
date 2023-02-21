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

export interface IConfigStatuses {
    useAppName?: boolean;
    useAppImg?: boolean;
    useInvites?: boolean;
}

export interface IConfigInit {
    botName: string;
    tokenJWT: string;
    isProduction?: boolean;
    botImg?: string;
    connectionRooms?: string[];
    useAppName?: boolean;
    useAppImg?: boolean;
    useInvites?: boolean;
}

export interface IConfig {
    init(data: IConfigInit): void;

    getConfigStatuses(): IConfigStatuses;

    getData(): IConfigData;

    setBotName(name: string): void;

    setBotImg(src: string): void;
}