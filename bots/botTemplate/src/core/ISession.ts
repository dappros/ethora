import { IBot } from './IBot';
import { ISessionState } from './ISessionState';
import {IKeyboard} from "../client/types/IKeyboard";

export interface ISession {
    bot: IBot;
    state: ISessionState;
    initialState: ISessionState;
    isNew: boolean;
    getUsername(): string;
    sendTextMessage(message: string | string[], keyboard?: IKeyboard): Promise<any>;
    sendCoinsToUser(amount: number, wallet?: string): void;
    subscribeToChatRoom(rooms: string | string[]): Promise<any>;
    resetState(): void;
    setState(state: ISessionState): void;
}