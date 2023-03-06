import {ISession} from "./ISession";
import {IMessage} from "./IMessage";
import {ISessionState} from "./ISessionState";
import {ISessionStore} from "../stores/ISessionStore";
import {IConnector} from "../connector/IConnector";
import {IStepper, TStep} from "./IStepper";

export interface IBotContext {
    session: ISession;
    message: IMessage;
    stepper: IStepper;
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
    usePresence?: boolean;
    isProduction?: boolean;
    presenceTimer?: number;
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
    use(patternOrHandler: BotHandler | RegExp | string, handler?: BotHandler, handlerStep?: TStep,): any;
}