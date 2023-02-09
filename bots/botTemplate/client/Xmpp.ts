import {Client} from "@xmpp/client";

class Xmpp {
    public client: Client;

    init(walletAddress: string, password: string) {
        if (!password) {
            return;
        }

        if (this.client) {
            return;
        }
    }
}