import EventEmitter = require("events");
import {IConnector, ConnectorEvent } from "./IConnector";
import {IUser} from "../core/IUser";
import {IMessageProps, MessageSender} from "../core/IMessage";
import XmppClient from "../client/XmppClient";
import ApplicationAPI from "../api/ApplicationAPI";
import {IAuthorization} from "../api/IAuthorization";
import {Message} from "../core/Message";
import {DOMAIN} from "../Config";
import {XmppSender} from "../client/XmppSender";
import {ISendTextMessageOptions} from "../client/IXmppSender";
import {IKeyboard} from "../client/types/IKeyboard";

export default class Connector extends EventEmitter implements IConnector {
    username: string;
    password: string;
    stanza: any;
    botAuthData: IAuthorization;

    constructor(username: string, password: string) {
        super();
        this.username = username;
        this.password = password;
    }

    getUniqueSessionKey(): string {
        return String(this.stanza.attrs.from.split("/").pop() + DOMAIN);
    }

    getCurrentRoomJID(): string {
        return String(this.stanza.getChild('data').attrs.roomJid);
    }

    getUser(): IUser {
        if (!this.stanza || !this.stanza.getChild('data')) {
            return;
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

    collectMessage(): IMessageProps {
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
            sender: this.botAuthData.data.botJID ===  this.getUniqueSessionKey() ? MessageSender.bot : MessageSender.user
        }
    }

    listen(): any {
        const API = new ApplicationAPI();
        const Xmpp = new XmppClient();

        API.userAuthorization(this.username, this.password).then(botAuthData => {
            this.botAuthData = botAuthData;

            //Initializing XMPP Client
            Xmpp.init(botAuthData.data.botJID, botAuthData.data.xmppPassword);
            //Listen for incoming messages and redirect them to a bot
            Xmpp.client.on("stanza", (stanza) => {
                //If there is "data" in the incoming "stanza", then these are message and the bot is processing it.
                if (stanza.getChild('body')) {
                    this.stanza = stanza;
                    const receivedMessage = new Message(this.collectMessage());
                    this.emit(ConnectorEvent.receiveMessage, receivedMessage);
                }
            });
        })
        return this;
    }
}

const toBooleanType = (text: string): boolean => {
    return text.replace(/^\s+|\s+$/g, "").toLowerCase() === "true";
};