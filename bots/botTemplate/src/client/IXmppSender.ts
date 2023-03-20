import {IAuthData} from "../api/IAuthorization";
import {IKeyboard} from "./types/IKeyboard";

export interface ISendTextMessageOptions {
    roomJID: string,
    senderData: IAuthData,
    message: string,
    keyboard?: IKeyboard,
}

export interface ISendSystemMessageOptions {
    roomJID: string,
    senderData: IAuthData,
    message: string,
    amount: number,
}

export interface IXmppSender{
    sendTextMessage(data: ISendTextMessageOptions): void;
}