import {IConfig, IConfigData, IConfigInit, IConfigStatuses} from "./IConfig";
import Logger from "../utils/Logger";

class Config implements IConfig {
    private data: IConfigData;
    private configStatuses: IConfigStatuses;

    init(data: IConfigInit): void {
        if (!data.botName) {
            throw Logger.error(new Error('botName (or username) is a required parameter to set the bot configuration.'));
        }

        if (!data.tokenJWT) {
            throw Logger.error(new Error('tokenJWT is a required parameter to set the bot configuration.'));
        }

        this.configStatuses = {
            useAppName: data.useAppName,
            useAppImg: data.useAppImg,
            useInvites: data.useInvites,
            usePresence: data.usePresence,
            useRoomsArchive: data.useRoomsArchive,
            useNameInMsg: data.useNameInMsg
        }

        const baseDomain = data.isProduction ? "dxmpp.com" : "dev.dxmpp.com";

        this.data = {
            isProduction: data.isProduction ? data.isProduction : false,
            baseDomain: baseDomain,

            conferenceDomain: '@conference.' + baseDomain,
            domain: "@" + baseDomain,
            service: `wss://${baseDomain}:5443/ws`,

            botName: data.botName,
            botImg: data.botImg ? data.botImg : 'https://cdn-icons-png.flaticon.com/512/9690/9690648.png',
            apiDomain: data.isProduction ? "https://app.dappros.com/v1/" : "https://app-dev.dappros.com/v1/",
            tokenJWT: data.tokenJWT,
            presenceTimer: data.presenceTimer ? data.presenceTimer : 0,

            connectionRooms: data.connectionRooms
        }
        Logger.info(`${this.data.botName} - Bot configuration data successfully set.`);

        if (data.useInvites) {
            Logger.info('Listening for invitations is enabled.')
        }

        if (data.usePresence) {
            Logger.info('Presence handling is enabled.')
        }

        if (data.useRoomsArchive) {
            Logger.info('Getting chat rooms from the archive handling is enabled.')
        }

        if (data.useNameInMsg) {
            Logger.info('The username is displayed in messages.')
        }
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
                presenceTimer: 0,
                connectionRooms: []
            };
        }
        return this.data;
    }

    getConfigStatuses(): IConfigStatuses {
        return this.configStatuses;
    }

    setBotName(name: string): void {
        this.data.botName = name;
    }

    setBotImg(src: string): void {
        this.data.botImg = src;
    }
}

export default new Config();