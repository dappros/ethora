import {xml} from "@xmpp/client";
import XmppClient from "./XmppClient";
import {IXmppRoom} from "./IXmppRoom";
import Logger from "../utils/Logger";

export class XmppRoom implements IXmppRoom {
    presenceInTheRoom(roomJID: string): void {
        const collectedRoomJID = roomJID + '/' + XmppClient.client.jid?.getLocal();

        Logger.info('Connecting to a chat room: ' + roomJID);

        const xmlData = xml('presence', {
            from: XmppClient.client.jid?.toString(),
            to: collectedRoomJID,
        }, xml('x', 'http://jabber.org/protocol/muc'));

        XmppClient.sender(xmlData);
    }

    getArchiveChatRooms(userJID: string): void {
        const xmlData = xml(
            "iq",
            {type: "set", id: userJID},
            xml(
                "query",
                {xmlns: "urn:xmpp:mam:2", queryid: "userArchive"},
                xml("set", {xmlns: "http://jabber.org/protocol/rsm"}, xml("before"))
            )
        );
        XmppClient.sender(xmlData);
    }
}