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
    presenceTimer: number;
    tokenName?: string;
    connectionRooms: string[];
}

export interface IConfigStatuses {
    useAppName?: boolean;
    useAppImg?: boolean;
    useInvites?: boolean;
    usePresence?: boolean;
    useRoomsArchive?: boolean;
    useNameInMsg?: boolean;
    useTyping?: boolean
}

export interface IConfigInit {
    botName: string;
    tokenJWT: string;
    isProduction?: boolean;
    botImg?: string;
    presenceTimer?: number;
    connectionRooms?: string[];
    tokenName?: string;
    useAppName?: boolean;
    useAppImg?: boolean;
    useInvites?: boolean;
    usePresence?: boolean;
    useRoomsArchive?: boolean;
    useNameInMsg?: boolean;
    useTyping?: boolean;
}

export interface IConfig {
    init(data: IConfigInit): void;

    getConfigStatuses(): IConfigStatuses;

    getData(): IConfigData;

    setBotName(name: string): void;

    setBotImg(src: string): void;

    setBotTokenName(name: string): void;
}