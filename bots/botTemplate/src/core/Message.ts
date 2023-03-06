import {IMessage, IMessageProps} from './IMessage';
import {IUser} from './IUser';

export class Message implements IMessage {
    data: IMessageProps;

    constructor(data: IMessageProps) {
        this.data = data;

        return this;
    }

    getText(): string {
        return this.data.message;
    }

    getUser(): IUser {
        return this.data.user;
    }

    getSessionKey(): string {
        return this.data.sessionKey;
    }

    filterText(keywords: string): boolean {
        const buildRegEx = new RegExp("(?=.*?\\b" +
            keywords
                .split(" ")
                .join(")(?=.*?\\b") +
            ").*",
            "i"
        );

        return buildRegEx.test(this.getText());
    }
}