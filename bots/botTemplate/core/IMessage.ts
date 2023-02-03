import {IUser} from "./IUser";

export enum MessageSender { bot, user }

export interface IMessageProps {
    rawData: any;
    user: IUser;
    sessionKey: string;
    sender: MessageSender;
}

export interface IMessage {
    data: IMessageProps;

    getText(): string;
}