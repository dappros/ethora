import XmppClient from "./XmppClient";
import {xml} from "@xmpp/client";
import Config from "../config/Config";
import {ISendSystemMessageOptions, ISendTextMessageOptions, IXmppSender} from "./IXmppSender";

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
        XmppClient.sender(xmlData);
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
}