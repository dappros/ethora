import {IUser} from "./IUser";

export enum MessageSender { bot, user }

export interface IMessageProps {
    data: {
        xmlns: string;
        isSystemMessage: boolean;
        tokenAmount: number;
        receiverMessageId: number;
        mucname: string;
        roomJid: string;
        isReply: boolean;
        mainMessageText: string;
        mainMessageId: string;
        mainMessageUserName: string;
        push: boolean;
    };
    message: string;
    user: IUser;
    sessionKey: string;
    sender: MessageSender;
}

export interface IMessage {
    data: IMessageProps;

    getText(): string;
}