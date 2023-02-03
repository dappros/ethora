import {ISession} from "./ISession";
import {IMessage} from "./IMessage";
import {ISessionState} from "./ISessionState";
import {ISessionStore} from "../stores/ISessionStore";
import {IConnector} from "../connectors/IConnector";

export interface IBotContext {
    session: ISession;
    message: IMessage;
    params?: object;
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