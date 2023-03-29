import {IUser} from "./IUser";
import {ITransaction} from "../api/IApplicationAPI";

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
        transaction: ITransaction | undefined;
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
    filterText(keywords: string): boolean;
}