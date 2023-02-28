import {BotHandler, IBot, IBotContext, IBotData} from "./IBot";
import {ISessionState} from "./ISessionState";
import {ISessionStore} from "../stores/ISessionStore";
import MemorySessionStore from "../stores/MemorySessionStore";
import {ConnectorEvent, IConnector} from "../connector/IConnector";
import Connector from "../connector/Connector";
import compose from "koa-compose";
import {ISession} from "./ISession";
import {Message} from './Message';
import {Session} from "./Session";
import Config from "../config/Config";
import {IConfigInit} from "../config/IConfig";


export default class Bot implements IBot {
    initialState: ISessionState = {};
    handlers: BotHandler[] = [];
    sessionStore: ISessionStore = new MemorySessionStore();
    connector: IConnector;
    config: any;

    constructor(data: IBotData) {
        Config.init(collectConfigurationData(data));

        this.connector = new Connector(data.username, data.password).listen();
        //Processing a received message
        this.connector.on(ConnectorEvent.receiveMessage, this.processMessage.bind(this));
        //Handling received presence
        this.connector.on(ConnectorEvent.receivePresence, this.processPresence.bind(this));

        return this;
    }

    async processHandlers(handlers: BotHandler[], context: IBotContext) {
        return compose(handlers)(context);
    }

    async getSession(message: Message): Promise<ISession> {
        const key = message.getSessionKey();
        let session = await this.sessionStore.find(key);

        if (session) {
            return session;
        }

        session = new Session({
            user: message.getUser(),
            bot: this,
            initialState: Object.assign({}, this.initialState)
        });

        return await this.sessionStore.add(key, session);
    }

    async processMessage(message: Message) {
        const session = await this.getSession(message);
        const context: IBotContext = {session, message};

        this
            .processHandlers(this.handlers, context)
            .catch((error) => {
                console.error(error);
            });
    }

    async processPresence(message: Message) {
        const session = await this.getSession(message);
        const context: IBotContext = {session, message};
        const {lastPresenceTime} = session.state;
        let dateDifference: number;
        const difference = Config.getData().presenceTimer;

        if (lastPresenceTime) {
            dateDifference = Math.abs(new Date(lastPresenceTime).valueOf() - new Date().valueOf()) / (1000 * 60);
        } else {
            dateDifference = difference;
        }

        if (dateDifference >= difference) {
            session.setState({lastPresenceTime: new Date()});
            this
                .processHandlers(this.handlers, context)
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    use(
        patternOrHandler: BotHandler | RegExp | string,
        maybeHandler?: BotHandler
    ) {
        const handler = maybeHandler || patternOrHandler as BotHandler;
        const pattern = patternOrHandler;

        if (typeof handler !== 'function') {
            throw new Error('BotHandler should be function');
        }

        if (pattern instanceof RegExp) {
            this.handlers.push((ctx, next) => {
                const text = ctx.message.getText();
                const match = text.match(pattern);

                if (match) {
                    ctx.params = match.length > 1 ? match.slice(1) : null;
                    return handler(ctx, next);
                }

                return next();
            });
        } else if (typeof pattern === 'string') {

            if (pattern === 'presence' && Config.getConfigStatuses().usePresence) {
                return this._usePresence(pattern, handler);
            }

            return this._useString(pattern, handler);

        } else {
            this.handlers.push(handler);
        }
    }

    _useString(pattern: RegExp | string, handler: BotHandler) {
        this.handlers.push((ctx, next) => {
            const text = ctx.message.getText();

            if (text === pattern) {
                return handler(ctx, next);
            }

            return next();
        });
    }

    _usePresence(pattern: RegExp | string, handler: BotHandler) {
        this.handlers.push((ctx, next) => {
            if (ctx.message.data.type === "isComposing") {
                return handler(ctx, next);
            }

            return next();
        });
    }
}

const collectConfigurationData = (data: IBotData): IConfigInit => {
    let isAppName = typeof data.useAppName == "boolean" ? data.useAppName : true;
    let isAppImg = typeof data.useAppImg == "boolean" ? data.useAppImg : true;
    let usePresence = typeof data.usePresence == "boolean" ? data.usePresence : false;
    let filteredPresenceTimer: number;

    if (data.botName) {
        isAppName = false;
    }
    if (data.useAppImg) {
        isAppImg = false;
    }
    if (data.presenceTimer > 0) {
        usePresence = true;
    }

    if (!data.presenceTimer || data.presenceTimer === 0) {
        if (usePresence) {
            filteredPresenceTimer = 1;
        } else {
            filteredPresenceTimer = 0;
        }
    } else {
        filteredPresenceTimer = data.presenceTimer;
    }
    return {
        botName: data.botName ? data.botName : data.username,
        tokenJWT: data.tokenJWT,
        isProduction: data.isProduction ? data.isProduction : false,
        botImg: data.botImg ? data.botImg : '',
        presenceTimer: filteredPresenceTimer,
        connectionRooms: data.connectionRooms ? data.connectionRooms : [],
        useAppName: isAppName,
        useAppImg: isAppImg,
        useInvites: typeof data.useInvites == "boolean" ? data.useInvites : false,
        usePresence: usePresence
    }
}