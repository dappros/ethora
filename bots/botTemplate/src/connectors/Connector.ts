import EventEmitter = require("events");
import {IConnector, ConnectorEvent } from "./IConnector";
import {IUser} from "../core/IUser";
import {IMessage, IMessageProps, MessageSender} from "../core/IMessage";
import XmppClient from "../client/XmppClient";
import ApplicationAPI from "../api/ApplicationAPI";
import {IAuthorization} from "../api/IAuthorization";
import {Message} from "../core/Message";
import {DOMAIN} from "../Config";

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

    getUniqueSessionKey() {
        return this.stanza.attrs.from.split("/").pop() + DOMAIN;
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

    async send(message: IMessage) {
        //sendMessage Logic
        console.log(message.getText());

        return Promise.resolve();
    }

    collectMessage(): IMessageProps {
        return {
            data: {
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
            sender: this.botAuthData.data.jid ===  this.getUniqueSessionKey() ? MessageSender.bot : MessageSender.user
        }
    }

    listen() {
        const API = new ApplicationAPI();
        API.userAuthorization(this.username, this.password).then(botAuthData => {
            //Initializing XMPP Client
            XmppClient.init(botAuthData.data.jid, botAuthData.data.xmppPassword);
            this.botAuthData = botAuthData;
            //Listen for incoming messages and redirect them to a bot
            XmppClient.client.on("stanza", (stanza) => {
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