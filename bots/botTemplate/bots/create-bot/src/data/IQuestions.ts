import {ISession, IKeyboard, IMessageProps, IUser} from "../../../../lib";


interface IMessage {
    messages: string[] | null,
    keyboard?: IKeyboard[]
}

interface IValidate {
    status: boolean;
    messages?: string[];
    keyboard?: IKeyboard[];
}

export type IQuestion = {
    name: string
    message: (user: IUser, answers?: any) => IMessage
    validateAnswer?: (session: ISession, data: IMessageProps, index: number) => IValidate
    handler: (session: ISession, data: IMessageProps, index: number) => void
}