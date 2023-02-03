import { IBot } from './IBot';
import { ISessionState } from './ISessionState';

export interface ISession {
    bot: IBot;
    state: ISessionState;
    initialState: ISessionState;
    isNew: boolean;
    getUsername(): string;
    send(message: any, options?: any): Promise<any>;
    resetState(): void;
    setState(state: ISessionState): void;
}