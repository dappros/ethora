import xmpp, {xml} from "@xmpp/client";
import {Client} from "@xmpp/client";
import Logger from "../utils/Logger";
import Config from "../config/Config";
import {IConnector} from "../connector/IConnector";
import {XmppRoom} from "./XmppRoom";

const isOnline = async (xmpp: any, connector: IConnector) => {
    await xmpp.client.send(xml("presence"));
    Logger.info('XMPP is Online')

    //Connection to default rooms, if they were specified.
    if (Config.getData().connectionRooms.length > 0) {
        Logger.info('Default chat rooms found, connection to them started.');
        await connector.connectToRooms(Config.getData().connectionRooms);
    }

    //Getting chat rooms from the archive if it is enabled
    if (Config.getConfigStatuses().useRoomsArchive) {
        const XmppConnect = new XmppRoom();
        XmppConnect.getArchiveChatRooms(xmpp.client.jid?.toString());
    }
}

class XmppClient {
    public client!: Client;

    init(botJID: string, xmppPassword: string, connector: IConnector) {

        if (!xmppPassword || !botJID) {
            return;
        }

        if (this.client) {
            return;
        }

        this.client = xmpp.client({
            service: Config.getData().baseDomain,
            username: botJID,
            password: xmppPassword,
        });

        this.client.start();
        Logger.info('XMPP Client starting...')

        this.client.on("online", () => isOnline(this, connector));
        this.client.on("offline", () => Logger.info('XMPP is offline.'));

        this.client.on("error", (error) => {
            Logger.error('XMPP on error' + error);
            this.stop();
            Logger.error('XMPP error, terminating collection');
        });
    }

    stop() {
        if (this.client) {
            this.client.stop();
            return;
        }
    }

    sender(data: any) {
        this.client.send(data).catch(error => {Logger.error('XMPP sender: ', error)});
    }
}

export default new XmppClient();