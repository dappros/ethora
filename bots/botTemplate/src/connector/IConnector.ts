import { IUser } from '../core/IUser';
import {IAuthorization} from "../api/IAuthorization";
import {IKeyboard} from "../client/types/IKeyboard";

export enum ConnectorEvent {
    receiveMessage = 'receiveMessage',
    receivePresence = 'receivePresence'
}

export interface IConnector {
    username: string;
    password: string;
    stanza: any;
    botAuthData: IAuthorization | undefined;
    getUniqueSessionKey(): string;
    getUser(): IUser;
    send(message: string, keyboard?: IKeyboard): Promise<void>;
    connectToRooms(connectionRooms: string[]): Promise<void>;
    botRegistration(username: string, password: string): any;
    listen(): any;
    on(event: ConnectorEvent, handler: () => any): void;
    emit(event: ConnectorEvent, data: any): void;
}