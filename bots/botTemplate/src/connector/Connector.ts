import EventEmitter = require("events");
import {IConnector, ConnectorEvent} from "./IConnector";
import {IUser} from "../core/IUser";
import {IMessageProps, MessageSender, TMessageType} from "../core/IMessage";
import XmppClient from "../client/XmppClient";
import ApplicationAPI from "../api/ApplicationAPI";
import {IAuthorization} from "../api/IAuthorization";
import {Message} from "../core/Message";
import {XmppSender} from "../client/XmppSender";
import {
    IMediaMessage,
    ISendMediaMessageOptions,
    ISendSystemMessageOptions,
    ISendTextMessageOptions
} from "../client/IXmppSender";
import {IKeyboard} from "../client/types/IKeyboard";
import Config from "../config/Config";
import Logger from "../utils/Logger";
import {XmppRoom} from "../client/XmppRoom";
import {IApplicationAPI, ITransaction} from "../api/IApplicationAPI";

export default class Connector extends EventEmitter implements IConnector {
    username: string;
    password: string;
    stanza: any;
    botAuthData: IAuthorization | undefined;
    xmpp: any;
    appAPI: IApplicationAPI

    constructor(username: string, password: string) {
        super();
        this.username = username;
        this.password = password;
        this.xmpp = XmppClient;
        this.appAPI = new ApplicationAPI();
    }

    getUniqueSessionKey(): string {
        return String(this.stanza.attrs.from.split("/").pop());
    }

    getCurrentRoomJID(): string {
        const stanzaData = this.stanza.getChild('data');
        return stanzaData.attrs.roomJid ? String(stanzaData.attrs.roomJid) : this.stanza.attrs.from.split('/')[0];
    }

    getUser(): IUser {
        const stanzaData = this.stanza.getChild('data');
        const stanzaType: TMessageType = this.stanza.attrs.id;

        if (!this.stanza || !stanzaData) {
            throw Logger.error(new Error('Unable to get user data without connecting to xmpp'));
        }

        return {
            userJID: stanzaData.attrs.senderJID ? String(stanzaData.attrs.senderJID) : this.stanza.attrs.to.split('/')[0] + Config.getData().domain,
            firstName: stanzaType === "sendMessage" ? String(stanzaData.attrs.senderFirstName) : stanzaData.attrs.fullName.split('/')[0],
            lastName: stanzaType === "sendMessage" ? String(stanzaData.attrs.senderLastName) : stanzaData.attrs.fullName.split('/')[0],
            photoURL: stanzaData.attrs.photoURL ? String(stanzaData.attrs.photoURL) : "",
            walletAddress: stanzaType === "sendMessage" ? String(stanzaData.attrs.senderWalletAddress) : String(this.stanza.attrs.to.split('@')[0])
        }
    }

    async send(message: string, keyboard?: IKeyboard) {
        if (!this.botAuthData) {
            throw Logger.error(new Error('Authorization data not found. Without this, it is impossible to send a message.'));
        }

        const Sender = new XmppSender();
        const data: ISendTextMessageOptions = {
            keyboard: keyboard ? keyboard : [],
            message: message,
            roomJID: this.getCurrentRoomJID(),
            senderData: this.botAuthData.data
        }

        return Promise.resolve(Sender.sendTextMessage(data));
    }

    async sendMedia(mediaData: IMediaMessage) {
        if (!this.botAuthData) {
            throw Logger.error(new Error('Authorization data not found. Without this, it is impossible to send a message.'));
        }

        const Sender = new XmppSender();
        const data: ISendMediaMessageOptions = {
            roomJID: this.getCurrentRoomJID(),
            senderData: this.botAuthData.data,
            mediaData
        }

        return Promise.resolve(Sender.sendMediaMessage(data));
    }

    sendCoins(amount: number, message: string, wallet: string) {
        if (!this.botAuthData) {
            throw Logger.error(new Error('Authorization data not found. Without this, it is impossible to send a coins.'));
        }

        this.appAPI.transferToken(amount, wallet).then(() => {
            const Sender = new XmppSender();
            const data: ISendSystemMessageOptions = {
                amount,
                message: message,
                roomJID: this.getCurrentRoomJID(),
                senderData: this.botAuthData.data
            }
            Sender.sendSystemMessage(data);
            return Promise.resolve();
        }).catch(error => {
            throw Logger.error(new Error(`Error sending coin: ${error}`));
        })


    }

    _collectMessage(stanzaBody: any, stanzaData: any, stanzaType: TMessageType, transaction?: ITransaction): IMessageProps {
        if (!this.botAuthData || !this.stanza) {
            throw Logger.error(new Error('Authorization data not found. This data is required to generate a message.'));
        }

        return {
            messageData: {
                xmlns: String(stanzaData.attrs.xmlns),
                isSystemMessage: toBooleanType(stanzaData.attrs.isSystemMessage),
                tokenAmount: stanzaData.attrs.tokenAmount ? Number(stanzaData.attrs.tokenAmount) : 0,
                receiverMessageId: stanzaData.attrs.receiverMessageId ? Number(stanzaData.attrs.receiverMessageId) : 0,
                mucname: stanzaData.attrs.mucname ? String(stanzaData.attrs.mucname) : "",
                roomJid: stanzaData.attrs.roomJid ? String(stanzaData.attrs.roomJid) : this.stanza.attrs.from.split('/')[0],
                isReply: toBooleanType(stanzaData.attrs.isReply),
                isMediafile: toBooleanType(stanzaData.attrs.isMediafile),
                fileName: stanzaData.attrs.fileName ? String(stanzaData.attrs.fileName) : '',
                location: stanzaData.attrs.location ? String(stanzaData.attrs.location) : '',
                locationPreview: stanzaData.attrs.locationPreview ? String(stanzaData.attrs.locationPreview) : '',
                mimetype: stanzaData.attrs.mimetype ? String(stanzaData.attrs.mimetype) : '',
                originalName: stanzaData.attrs.originalName ? String(stanzaData.attrs.originalName) : '',
                attachmentId: stanzaData.attrs.attachmentId ? String(stanzaData.attrs.attachmentId) : '',
                size: stanzaData.attrs.size ? Number(stanzaData.attrs.size) : 0,
                wrappable: toBooleanType(stanzaData.attrs.isMediafile),
                mainMessageText: stanzaData.attrs.mainMessageText ? String(stanzaData.attrs.mainMessageText) : "",
                mainMessageId: stanzaData.attrs.mainMessageId ? String(stanzaData.attrs.mainMessageId) : "",
                mainMessageUserName: stanzaData.attrs.mainMessageUserName ? String(stanzaData.attrs.mainMessageUserName) : "",
                push: toBooleanType(stanzaData.attrs.push),
                notDisplayedValue: stanzaData.attrs.notDisplayedValue ? String(stanzaData.attrs.notDisplayedValue) : "",
                transaction: transaction ? transaction : undefined
            },
            message: stanzaBody ? String(stanzaBody.getText()) : "",
            user: this.getUser(),
            sessionKey: this.getUniqueSessionKey(),
            sender: this.botAuthData.data.botJID === this.getUniqueSessionKey() ? MessageSender.bot : MessageSender.user,
            type: stanzaType
        }
    }

    connectToRooms(connectionRooms: string[]): Promise<void> {
        const XmppConnect = new XmppRoom();
        connectionRooms.forEach(room => XmppConnect.presenceInTheRoom(String(room)));
        return Promise.resolve();
    }

    botRegistration(username: string, password: string): any {
        Logger.warn(`The user is not found, starting registration. ( ${username} )`);

        return this.appAPI.userRegistration(username, password).then(result => {
            Logger.info(`User ${result.firstName} has been successfully created, starting authorization.`);
            return this.listen();
        }).catch(error => {
            throw Logger.error(new Error(`An error occurred during registration: ${error}`));
        });
    }

    _setAuthConfiguration(botAuthData: IAuthorization): void {
        if (Config.getConfigStatuses().useAppName) {
            Logger.info(`Bot name obtained from application: ${botAuthData.data.firstName}`);
            Config.setBotName(botAuthData.data.firstName);
        }

        if (Config.getConfigStatuses().useAppImg) {
            if (botAuthData.data.photo && botAuthData.data.photo !== 'undefined') {
                Logger.info(`Bot image obtained from the application: ${botAuthData.data.photo}`);
                Config.setBotImg(botAuthData.data.photo);
            }
        }
    }


    listen(): any {
        this.appAPI.userAuthorization(this.username, this.password).then(botAuthData => {

            //If authorization is not successful with "User do not found" registration is started
            if (!botAuthData.success) {
                return this.botRegistration(this.username, this.password);
            }

            if (botAuthData.data.botJID === 'undefined' || botAuthData.data.xmppPassword === 'undefined') {
                throw Logger.error(new Error('Authorization error, perhaps the login or password is incorrect, and the JWT token could also be out of date.'));
            }

            this.botAuthData = botAuthData;
            Logger.info('Bot authorization successful.');

            this._setAuthConfiguration(botAuthData);

            //Initializing XMPP Client
            this.xmpp.init(botAuthData.data.botJID, botAuthData.data.xmppPassword, this);

            //Listen for incoming messages and redirect them to a bot
            this.xmpp.client.on("stanza", (stanza: any) => {
                this.stanza = stanza;

                if (!stanza.attrs.from) {
                    return this;
                }

                // Run a method that determines the process depending on the conditions
                return this._eventRouter(stanza);
            });
        }).catch(error => {
            throw Logger.error(new Error(`An error occurred during authorization. ${error}`));
        })
        return this;
    }

    _eventRouter(stanza: any): void {
        const messageSender: 'bot' | 'user' = this.botAuthData.data.botJID === stanza.attrs.from.split('/')[1] ? 'bot' : 'user';
        const stanzaBody: any = stanza.getChild('body');
        const stanzaData: any = stanza.getChild('data');
        const stanzaType: TMessageType = stanza.attrs.id;
        const isArchiveInvite = stanza.getChild('result')?.getChild('forwarded')?.getChild('message')?.getChild('x')?.getChild('invite');

        if (isArchiveInvite) {
            let lastArchiveJID = '';
            const inviteArchiveJID = stanza.getChild('result')?.getChild('forwarded')?.getChild('message')?.attrs.from;

            if (lastArchiveJID !== inviteArchiveJID) {
                this.connectToRooms([inviteArchiveJID]);
            }
            lastArchiveJID = inviteArchiveJID;
        }

        // Send message if user presence detected
        if (stanzaType === 'isComposing' && stanzaData && Config.getConfigStatuses().usePresence && messageSender === 'user') {
            return this._presenceEvent(stanzaBody, stanzaData, stanzaType);
        }

        if (stanzaBody && messageSender === 'user') {

            //Processing the receipt of coins by the bot
            if (
                stanzaData &&
                stanzaData.attrs.isSystemMessage === "true" &&
                stanzaData.attrs.tokenAmount > 0 &&
                stanzaData.attrs.transactionId &&
                stanza.attrs.to.split("/")[0] === this.xmpp.client.jid?.toString().split("/")[0]
            ) {
                this.appAPI.getTransactions(this.botAuthData.data.walletAddress).then(result => {
                    const transaction = result.items.find(el => el.to === this.botAuthData.data.walletAddress && el._id === stanzaData.attrs.transactionId);
                    if(transaction){
                        return this._receivingCoinsEvent(stanzaBody, stanzaData, stanzaType, transaction);
                    }
                    return Logger.error(new Error(`No matching transaction found.`));
                }).catch(error => {
                    return Logger.error(new Error(`Failed to get bot transaction list. ${error}`));
                })
            }

            // Processing an incoming chat room invitation
            if (Config.getConfigStatuses().useInvites) {
                if (stanza.getChild('x') && stanza.getChild('x').getChild('invite') && stanzaData.attrs.isSystemMessage === "false") {
                    this._inviteEvent(stanzaBody);
                }
            }

            //If there is "data" in the incoming "stanza", then these are message and the bot is processing it.
            if (stanza.is("message") && stanzaData && stanzaBody && stanzaType === "sendMessage" && stanzaData.attrs.isSystemMessage  === "false") {

                // console.log("SUKA => ", stanzaBody.getText(), this.botAuthData.data.botJID, stanza.attrs.from.split('/')[1])
                this._messageEvent(stanzaBody, stanzaData, stanzaType);
            }

        }
    }

    _receivingCoinsEvent(stanzaBody: any, stanzaData: any, stanzaType: TMessageType, transaction: ITransaction): void {
        const receivedMessage = new Message(this._collectMessage(stanzaBody, stanzaData, stanzaType, transaction));
        Logger.info(`Coins received from: ${stanzaData.attrs.senderWalletAddress}`);
        this.emit(ConnectorEvent.receiveMessage, receivedMessage, this.appAPI, 'coinReceived');
    }

    _presenceEvent(stanzaBody: any, stanzaData: any, stanzaType: TMessageType): void {
        const receivedMessage = new Message(this._collectMessage(stanzaBody, stanzaData, stanzaType));
        this.emit(ConnectorEvent.receivePresence, receivedMessage, this.appAPI, 'presence');
    }

    _inviteEvent(stanzaBody: any): void {
        Logger.info(`Accepted invite to the room: ${stanzaBody.parent.attrs.from}`);
        this.connectToRooms([String(stanzaBody.parent.attrs.from)]);
    }

    _messageEvent(stanzaBody: any, stanzaData: any, stanzaType: TMessageType): void {
        const receivedMessage = new Message(this._collectMessage(stanzaBody, stanzaData, stanzaType));
        Logger.info('Received: ' + receivedMessage.getText());
        this.emit(ConnectorEvent.receiveMessage, receivedMessage, this.appAPI, 'message');
    }
}

const toBooleanType = (text: string): boolean => {
    if (!text) {
        return false;
    }
    return text.replace(/^\s+|\s+$/g, "").toLowerCase() === "true";
};