import { IUser } from '../core/IUser';
import { IMessage } from '../core/IMessage';

export enum ConnectorEvent {
    receiveMessage = 'receiveMessage'
}

export interface IConnector {
    getConnectorName(): string;
    getUniqueSessionKey(rawData?: {}): string;
    getUser(): Promise<IUser>;
    send(message: IMessage, user: IUser, options: any): Promise<void>;
    // listen(): any;
    on(event: ConnectorEvent, handler: () => any): void;
    emit(event: ConnectorEvent, data: any): void;
}