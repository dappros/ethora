import XmppClient from "./XmppClient";
import {xml} from "@xmpp/client";
import Config from "../config/Config";
import {ISendSystemMessageOptions, ISendTextMessageOptions, IXmppSender, TTyping} from "./IXmppSender";

export class XmppSender implements IXmppSender {
    sendTextMessage(data: ISendTextMessageOptions): void {
        const configData = Config.getData();

        const xmlData = xml(
            "message",
            {
                to: data.roomJID,
                type: "groupchat",
                id: "sendMessage",
            },
            xml("data", {
                xmlns: configData.service,
                senderFirstName: configData.botName,
                senderLastName: 'Bot',
                photoURL: configData.botImg,
                senderJID: data.senderData.botJID,
                senderWalletAddress: data.senderData.walletAddress,
                roomJid: data.roomJID,
                isSystemMessage: false,
                tokenAmount: 0,
                quickReplies: data.keyboard ? JSON.stringify(data.keyboard) : [],
            }),
            xml("body", {}, data.message)
        );
        this.sendWithTyping(xmlData, data.roomJID, data.senderData.walletAddress, data.message);
    }

    sendSystemMessage(data: ISendSystemMessageOptions): void {
        const configData = Config.getData();

        const xmlData = xml(
            "message",
            {
                to: data.roomJID,
                type: "groupchat",
                id: "sendMessage",
            },
            xml("data", {
                xmlns: configData.service,
                senderFirstName: configData.botName,
                senderLastName: 'Bot',
                senderJID: data.senderData.botJID,
                senderWalletAddress: data.senderData.walletAddress,
                roomJid: data.roomJID,
                isSystemMessage: true,
                tokenAmount: data.amount,
            }),
            xml("body", {}, data.message)
        );
        XmppClient.sender(xmlData);
    }

    sendTyping(roomJID: string, type: TTyping, botWalletAddress: string): void {
        const configData = Config.getData();

        const xmlData = xml('message', {
            to: roomJID,
            type: 'groupchat',
            id: type
        }, xml('composing', {
            xmlns: 'http://jabber.org/protocol/chatstates',
        }), xml('data', {
            xmlns: configData.service,
            fullName: `${configData.botName} Bot`,
            senderWalletAddress: botWalletAddress
        }));
        XmppClient.sender(xmlData);
    }

    sendWithTyping(xml: any, roomJID: string, botWalletAddress: string, message: string): void {
        if (Config.getConfigStatuses().useTyping) {
            this.sendTyping(roomJID, 'isComposing', botWalletAddress)

            setTimeout(() => {
                XmppClient.sender(xml);
                this.sendTyping(roomJID, 'pausedComposing', botWalletAddress);

            }, this._getWritingTime(message))

        } else {
            XmppClient.sender(xml)
        }
    }

    _getWritingTime(message: string): number {
        if (message.length <= 120) {
            return 2000
        }
        if (message.length <= 250 && message.length > 120) {
            return 3500
        }
        if (message.length <= 400 && message.length > 250) {
            return 5000
        }
        if (message.length > 500) {
            return 6000
        }
        return 2000;
    }
}