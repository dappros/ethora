import EventEmitter = require("events");
import {IConnector, ConnectorEvent} from "./IConnector";
import {IUser} from "../core/IUser";
import {IMessageProps, MessageSender} from "../core/IMessage";
import XmppClient from "../client/XmppClient";
import ApplicationAPI from "../api/ApplicationAPI";
import {IAuthorization} from "../api/IAuthorization";
import {Message} from "../core/Message";
import {XmppSender} from "../client/XmppSender";
import {ISendTextMessageOptions} from "../client/IXmppSender";
import {IKeyboard} from "../client/types/IKeyboard";
import Config from "../config/Config";
import Logger from "../utils/Logger";
import {XmppRoom} from "../client/XmppRoom";
import {IApplicationAPI} from "../api/IApplicationAPI";

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
        return String(this.stanza.attrs.from.split("/").pop() + Config.getData().domain);
    }

    getCurrentRoomJID(): string {
        return String(this.stanza.getChild('data').attrs.roomJid);
    }

    getUser(): IUser {
        if (!this.stanza || !this.stanza.getChild('data')) {
            throw Logger.error(new Error('Unable to get user data without connecting to xmpp'));
        }

        return {
            userJID: String(this.stanza.getChild('data').attrs.senderJID),
            firstName: String(this.stanza.getChild('data').attrs.senderFirstName),
            lastName: String(this.stanza.getChild('data').attrs.senderLastName),
            photoURL: String(this.stanza.getChild('data').attrs.photoURL),
            walletAddress: String(this.stanza.getChild('data').attrs.senderWalletAddress)
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
        Sender.sendTextMessage(data);
        return Promise.resolve();
    }

    _collectMessage(): IMessageProps {
        if (!this.botAuthData) {
            throw Logger.error(new Error('Authorization data not found. This data is required to generate a message.'));
        }

        return {
            messageData: {
                xmlns: String(this.stanza.getChild('data').attrs.xmlns),
                isSystemMessage: toBooleanType(this.stanza.getChild('data').attrs.isSystemMessage),
                tokenAmount: Number(this.stanza.getChild('data').attrs.tokenAmount),
                receiverMessageId: Number(this.stanza.getChild('data').attrs.receiverMessageId),
                mucname: String(this.stanza.getChild('data').attrs.mucname),
                roomJid: String(this.stanza.getChild('data').attrs.roomJid),
                isReply: toBooleanType(this.stanza.getChild('data').attrs.isReply),
                mainMessageText: String(this.stanza.getChild('data').attrs.mainMessageText),
                mainMessageId: String(this.stanza.getChild('data').attrs.mainMessageId),
                mainMessageUserName: String(this.stanza.getChild('data').attrs.mainMessageUserName),
                push: toBooleanType(this.stanza.getChild('data').attrs.push)
            },
            message: String(this.stanza.getChild('body').getText()),
            user: this.getUser(),
            sessionKey: this.getUniqueSessionKey(),
            sender: this.botAuthData.data.botJID === this.getUniqueSessionKey() ? MessageSender.bot : MessageSender.user
        }
    }

    connectToRooms(connectionRooms: string[]): Promise<void> {
        const XmppConnect = new XmppRoom();
        connectionRooms.forEach(room => XmppConnect.presenceInTheRoom(String(room)));
        return Promise.resolve();
    }

    listen(): any {
        this.appAPI.userAuthorization(this.username, this.password).then(botAuthData => {

            if (!botAuthData.success) {
                Logger.warn(`The user is not found, starting registration. ( ${this.username} )`);

                return this.appAPI.userRegistration(this.username, this.password).then(result => {
                    Logger.info(`User ${result.firstName} has been successfully created, starting authorization.`);
                    return this.listen();
                }).catch(error => {
                    throw Logger.error(new Error(`An error occurred during registration: ${error}`));
                });
            }

            this.botAuthData = botAuthData;
            Logger.info('Bot authorization successful.');
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

            if (botAuthData.data.botJID === 'undefined' || botAuthData.data.xmppPassword === 'undefined') {
                throw Logger.error(new Error('Authorization error, perhaps the login or password is incorrect, and the JWT token could also be out of date.'));
            }

            //Initializing XMPP Client
            this.xmpp.init(botAuthData.data.botJID, botAuthData.data.xmppPassword, this);

            //Listen for incoming messages and redirect them to a bot
            this.xmpp.client.on("stanza", (stanza: any) => {
                const stanzaBody = stanza.getChild('body');
                if (stanza.getChild('body')) {
                    this.stanza = stanza;

                    // Processing an incoming chat room invitation
                    if (Config.getConfigStatuses().useInvites) {
                        if (stanza.getChild('x') && stanza.getChild('x').getChild('invite')) {
                            Logger.info(`Accepted invite to the room: ${stanzaBody.parent.attrs.from}`);
                            this.connectToRooms([String(stanzaBody.parent.attrs.from)]);
                        }
                    }

                    //If there is "data" in the incoming "stanza", then these are message and the bot is processing it.
                    if (stanza.getChild('data')) {
                        const receivedMessage = new Message(this._collectMessage());
                        Logger.info('Received: ' + receivedMessage.getText());
                        this.emit(ConnectorEvent.receiveMessage, receivedMessage);
                    }

                }
            });
        }).catch(error => {
            throw Logger.error(new Error(`An error occurred during authorization. ${error}`));
        })
        return this;
    }
}

const toBooleanType = (text: string): boolean => {
    if (!text) {
        return false;
    }
    return text.replace(/^\s+|\s+$/g, "").toLowerCase() === "true";
};