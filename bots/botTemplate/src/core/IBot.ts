import {ISession} from "./ISession";
import {IMessage} from "./IMessage";
import {ISessionState} from "./ISessionState";
import {ISessionStore} from "../stores/ISessionStore";
import {IConnector} from "../connector/IConnector";

export interface IBotContext {
    session: ISession;
    message: IMessage;
    params?: object;
}

export interface IBotData {
    username: string;
    password: string;
    tokenJWT: string;
    botName?: string;
    useAppName?: boolean;
    useAppImg?: boolean;
    useInvites?: boolean;
    isProduction?: boolean;
    botImg?: string;
    connectionRooms?: string[];
}

export type BotHandler = (context: IBotContext, next?: () => void) => void;

export interface IBot {
    initialState: ISessionState;
    handlers: BotHandler[];
    sessionStore: ISessionStore;
    connector: IConnector;
    getSession(message: IMessage): Promise<ISession>;
    processMessage(message: IMessage): void;
    processHandlers(handlers: BotHandler[], context: IBotContext): any;
    use(patternOrHandler: BotHandler | RegExp | string, handler?: BotHandler): any;
}