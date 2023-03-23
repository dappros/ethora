import {ISession} from "./ISession";
import {IMessage} from "./IMessage";
import {ISessionState} from "./ISessionState";
import {ISessionStore} from "../stores/ISessionStore";
import {IConnector} from "../connector/IConnector";
import {IStepper, TStep} from "./IStepper";
import {Message} from "./Message";
import {IApplicationAPI} from "../api/IApplicationAPI";

export interface IBotContext {
    session: ISession;
    message: IMessage;
    stepper: IStepper;
    api: IApplicationAPI
    params?: object;
}

export interface IBotData {
    username: string;
    password: string;
    tokenJWT: string;
    botName?: string;
    tokenName?: string;
    useAppName?: boolean;
    useAppImg?: boolean;
    useInvites?: boolean;
    usePresence?: boolean;
    useNameInMsg?: boolean;
    useRoomsArchive?: boolean;
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
    processMessage(message: Message, api: IApplicationAPI);
    processHandlers(handlers: BotHandler[], context: IBotContext, api: IApplicationAPI): any;
    use(possiblePattern: BotHandler | RegExp | string, handler?: BotHandler, handlerStep?: TStep,): any;
}