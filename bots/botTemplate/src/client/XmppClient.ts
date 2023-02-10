import xmpp, {xml} from "@xmpp/client";
import {Client} from "@xmpp/client";

class XmppClient {
    public client: Client;
    public botJID: string;

    init(botJID: string, xmppPassword: string) {
        if (!xmppPassword) {
            return;
        }

        if (this.client) {
            return;
        }
        this.botJID = botJID;

        this.client = xmpp.client({
            service: "dev.dxmpp.com",
            username: botJID,
            password: xmppPassword,
        });

        this.client.start();

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