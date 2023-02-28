import {IUser} from "./IUser";

export enum MessageSender { bot, user }

export type TMessageType = "isComposing" | "sendMessage";

export interface IMessageProps {
    messageData: {
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
    type: TMessageType
}

export interface IMessage {
    data: IMessageProps;

    getText(): string;
}