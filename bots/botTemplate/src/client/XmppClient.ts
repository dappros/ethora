import xmpp, {xml} from "@xmpp/client";
import {Client} from "@xmpp/client";

const isOnline = (xmpp: any) => {
    xmpp.client.send(xml("presence"));

    console.log("=> Xmpp is Online")
}

export default class XmppClient {
    public client!: Client;
    public botJID: string;

    init(botJID: string, xmppPassword: string) {
        if (!xmppPassword) {
            return;
        }

        if (this.client) {
            return;
        }

        this.client = xmpp.client({
            service: "dev.dxmpp.com",
            username: botJID,
            password: xmppPassword,
        });

        this.client.start();

        this.client.on("online", () => isOnline(this));
        this.client.on("offline", () => console.log("=> XMPP is offline."));

        this.client.on("error", (error) => {
            console.log("=> XMPP on error: ", error);
            this.stop();
            console.log("=> XMPP error, terminating collection");
        });
    }

    stop() {
        if (this.client) {
            this.client.stop();
            return;
        }
    }
}