import {IBot} from './IBot';
import {IUser} from './IUser';
import {ISessionState} from './ISessionState';
import {ISession} from './ISession';
import {IKeyboard} from "../client/types/IKeyboard";
import Config from "../config/Config";
import {IMediaMessage} from "../client/IXmppSender";

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

    async sendTextMessage(message: string | string[], keyboard?: IKeyboard) {
        const configStatuses = Config.getConfigStatuses();
        configStatuses.usePresence ? this.setState({lastPresenceTime: new Date()}) : null;
        this.isNew = false;

        if (Array.isArray(message)) {
            for (const [index, msg] of message.entries()) {
                let textMsg = msg;
                configStatuses.useNameInMsg && Number(index) === 0 ? textMsg = `${this.getUsername()} \n${msg}` : null;
                if (Number(index) === message.length - 1) {
                    return this.bot.connector.send(textMsg, keyboard)
                }
                  await this.bot.connector.send(textMsg)
            }
        } else {
            let textMsg = message;
            configStatuses.useNameInMsg ? textMsg = `${this.getUsername()} \n ${message}` : null;
            return this.bot.connector.send(textMsg, keyboard);
        }
    }

    async sendMediaMessage(data: IMediaMessage){
        return this.bot.connector.sendMedia(data);
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