import {IConfig, IConfigData} from "./IConfig";
import Logger from "../utils/Logger";

class Config implements IConfig {
    private data: IConfigData

    init(
        botName: string,
        tokenJWT: string,
        isProduction?: boolean,
        botImg?: string,
        connectionRooms?: string[]
    ): void {
        if (!botName) {
            throw Logger.error(new Error('botName (or username) is a required parameter to set the bot configuration.'));
        }

        if (!tokenJWT) {
            throw Logger.error(new Error('tokenJWT is a required parameter to set the bot configuration.'));
        }

        const baseDomain = isProduction ? "dxmpp.com" : "dev.dxmpp.com";
        this.data = {
            isProduction: isProduction ? isProduction : false,
            baseDomain: baseDomain,

            conferenceDomain: '@conference.' + baseDomain,
            domain: "@" + baseDomain,
            service: `wss://${baseDomain}:5443/ws`,

            botName: botName,
            botImg: botImg ? botImg : 'https://cdn-icons-png.flaticon.com/512/9690/9690648.png',
            apiDomain: isProduction ? "https://app.dappros.com/v1/" : "https://app-dev.dappros.com/v1/",
            tokenJWT: tokenJWT,

            connectionRooms: connectionRooms
        }
        Logger.info(this.data.botName + ' - Bot configuration data successfully set.')
        return;
    }

    getData(): IConfigData {
        if (!this.data) {
            return {
                isProduction: false,
                baseDomain: "dxmpp.com",
                botName: "EthoraBot",
                conferenceDomain: '@conference.dxmpp.com',
                domain: "@dxmpp.com",
                service: `wss://dxmpp.com:5443/ws`,
                botImg: 'https://cdn-icons-png.flaticon.com/512/9690/9690648.png',
                apiDomain: "https://app-dev.dappros.com/v1/",
                tokenJWT: '',
                connectionRooms: []
            };
        }
        return this.data;
    }
}

export default new Config();