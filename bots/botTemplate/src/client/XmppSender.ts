import XmppClient from "./XmppClient";
import {xml} from "@xmpp/client";
import Config from "../config/Config";
import {ISendTextMessageOptions, IXmppSender} from "./IXmppSender";

export class XmppSender implements IXmppSender {
    sendTextMessage(data: ISendTextMessageOptions): void {
        const xmlData = xml(
            "message",
            {
                to: data.roomJID,
                type: "groupchat",
                id: "sendMessage",
            },
            xml("data", {
                xmlns: Config.getData().service,
                senderFirstName: data.senderData.firstName,
                senderLastName: data.senderData.lastName,
                photoURL: data.senderData.photo,
                senderJID: data.senderData.botJID,
                senderWalletAddress: data.senderData.walletAddress,
                roomJid: data.roomJID,
                isSystemMessage: false,
                tokenAmount: 0,
                quickReplies: data.keyboard ? data.keyboard : [],
            }),
            xml("body", {}, data.message)
        );
        XmppClient.sender(xmlData);
    }
}