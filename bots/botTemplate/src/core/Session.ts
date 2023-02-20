import {IBot} from './IBot';
import {IUser} from './IUser';
import {ISessionState} from './ISessionState';
import {ISession} from './ISession';
import {IKeyboard} from "../client/types/IKeyboard";

interface ISessionConstructorProps {
    user: IUser;
    bot: IBot;
    initialState?: ISessionState;
}

export class Session implements ISession {
    bot: IBot;
    state: ISessionState;
    initialState: ISessionState = {};
    isNew: boolean = true;
    user: IUser;

    constructor({user, bot, initialState}: ISessionConstructorProps) {
        this.bot = bot;
        this.initialState = initialState || {};
        this.state = {...initialState};
        this.user = user;
    }

    getUsername(): string {
        return this.user.firstName;
    }

    sendTextMessage(message: string, keyboard?: IKeyboard) {
        this.isNew = false;

        return this.bot.connector.send(message, keyboard);
    }

    subscribeToChatRoom(rooms: string | string[]) {
        if (Array.isArray(rooms)) {
            return this.bot.connector.connectToRooms(rooms);
        }

        const roomsString = String(rooms);
        return this.bot.connector.connectToRooms(roomsString.split(","));
    }

    resetState(): void {
        this.state = {...this.initialState};
    }

    setState(state: ISessionState): void {
        Object.keys(state).forEach((key) => {
            this.state[key] = state[key];
        });
    }
}