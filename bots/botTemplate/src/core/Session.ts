import {IBot} from './IBot';
import {IUser} from './IUser';
import {ISessionState} from './ISessionState';
import {ISession} from './ISession';
import {IKeyboard} from "../client/types/IKeyboard";
import Config from "../config/Config";

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
        return `${this.user.firstName} ${this.user.lastName}`;
    }

    sendTextMessage(message: string, keyboard?: IKeyboard) {
        const configStatuses = Config.getConfigStatuses();
        let textMsg = message;
        this.isNew = false;
        configStatuses.usePresence ? this.setState({lastPresenceTime: new Date()}) : null;
        configStatuses.useNameInMsg ? textMsg = `${this.getUsername()} ${message}` : null;
        return this.bot.connector.send(textMsg, keyboard);
    }

    subscribeToChatRoom(rooms: string | string[]) {
        if (Array.isArray(rooms)) {
            return this.bot.connector.connectToRooms(rooms);
        }

        const roomsString = String(rooms);
        return this.bot.connector.connectToRooms(roomsString.split(","));
    }

    sendCoinsToUser(amount: number, wallet?: string): void {
        const receiverWallet = wallet ? wallet : this.user.walletAddress;
        const configData = Config.getData();
        const systemMessage = `${configData.botName} Bot -> ${amount} ${configData.tokenName} -> ${this.getUsername()}`;

        return this.bot.connector.sendCoins(amount, systemMessage, receiverWallet)
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