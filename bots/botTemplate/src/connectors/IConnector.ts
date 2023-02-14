import { IUser } from '../core/IUser';
import { IMessage } from '../core/IMessage';
import {IAuthorization} from "../api/IAuthorization";
import {IKeyboard} from "../client/types/IKeyboard";

export enum ConnectorEvent {
    receiveMessage = 'receiveMessage'
}

export interface IConnector {
    username: string;
    password: string;
    stanza: any;
    botAuthData: IAuthorization;
    getUniqueSessionKey(): string;
    getUser(): IUser;
    send(message: string, keyboard?: IKeyboard): Promise<void>;
    listen(): any;
    on(event: ConnectorEvent, handler: () => any): void;
    emit(event: ConnectorEvent, data: any): void;
}