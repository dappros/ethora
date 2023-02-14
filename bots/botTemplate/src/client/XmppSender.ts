import XmppClient from "./XmppClient";
import {xml} from "@xmpp/client";
import {SERVICE} from "../Config";
import {ISendTextMessageOptions, IXmppSender} from "./IXmppSender";

export class XmppSender extends XmppClient implements IXmppSender{
    constructor() {
        super();
    }

    sendTextMessage(data: ISendTextMessageOptions): void {
        this.client.send(xml(
            "message",
            {
                to: data.roomJID,
                type: "groupchat",
                id: "sendMessage",
            },
            xml("data", {
                xmlns: SERVICE,
                senderFirstName: data.senderData.firstName,
                senderLastName: data.senderData.lastName,
                photoURL: data.senderData.photo,
                senderJID: this.botJID,
                senderWalletAddress: data.senderData.walletAddress,
                roomJid: data.roomJID,
                isSystemMessage: false,
                tokenAmount: 0,
                quickReplies: data.keyboard ? data.keyboard : [],
            }),
            xml("body", {}, data.message)
        ))
    }
}