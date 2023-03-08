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
import Logger from "../utils/Logger";
import {IStepData, IStepper, TStep} from "./IStepper";
import {Stepper} from "./Stepper";


export default class Bot implements IBot {
    initialState: ISessionState = {};
    handlers: BotHandler[] = [];
    sessionStore: ISessionStore = new MemorySessionStore();
    connector: IConnector;
    stepper: IStepper;
    config: any;
    initSteps: IStepData[] = [];

    constructor(data: IBotData) {
        Config.init(this._collectConfigurationData(data));

        this.connector = new Connector(data.username, data.password).listen();
        //Processing a received message
        this.connector.on(ConnectorEvent.receiveMessage, this.processMessage.bind(this));
        //Handling received presence
        this.connector.on(ConnectorEvent.receivePresence, this.processPresence.bind(this));
        this.initialState = {stepList: []};

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

    getStepper(session: ISession) {
        //Creating a stepper with an actual session.
        this.stepper = new Stepper(session);
        return this.stepper;
    }

    async processMessage(message: Message) {
        const session = await this.getSession(message);
        const stepper = this.getStepper(session);
        const context: IBotContext = {session, message, stepper};

        this
            .processHandlers(this.handlers, context)
            .catch((error) => {
                console.error(error);
            });
    }

    async processPresence(message: Message) {
        const session = await this.getSession(message);
        const stepper = this.getStepper(session);
        const context: IBotContext = {session, message, stepper};
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
        possiblePattern: BotHandler | RegExp | string,
        possibleHandler?: BotHandler | TStep,
        handlerStep?: TStep,
    ) {
        const handler = possibleHandler && typeof possibleHandler === 'function' ? possibleHandler : possiblePattern as BotHandler;
        const pattern = possiblePattern;
        const step = handlerStep && typeof possiblePattern !== 'function' ? handlerStep : possibleHandler as TStep;

        if (typeof handler !== 'function') {
            throw Logger.error(new Error(`Handler must be a function.`));
        }

        this._saveSteps(step);
        return this._useRouter(pattern, handler, typeof step === 'function' ? null : step);
    }

    _saveSteps(step: string | number): void {
        if (!step || typeof step === 'function') {
            return;
        }
        const stepIndex = this.initSteps.findIndex(el => el.stepName === step);
        if (stepIndex !== -1) {
            throw Logger.error(new Error(`Duplicate steps in handlers.`));
        }

        const stepData: IStepData = {
            stepName: step,
            onStep: false,
            editing: false
        }
        this.initSteps = [...this.initSteps, stepData];
    }

    _useRouter(pattern: BotHandler | RegExp | string, handler: BotHandler, step?: string | number): any {
        this.handlers.push((ctx, next) => {
            ctx.stepper.addStepList(this.initSteps);

            const currentUserStep = ctx.stepper.getUserStep();
            if (currentUserStep && !step) {
                return next();
            }

            if (step) {
                if (!currentUserStep) {
                    return next();
                }

                if (currentUserStep && step === currentUserStep) {
                    ctx.stepper.setOnStep(step, true);
                    ctx.stepper.setStepEditing(step, true);
                } else {
                    return next();
                }
            }

            //Processing an incoming RegExp pattern
            if (pattern instanceof RegExp) {
                return this._useRegExp(pattern, handler, ctx, next);

            } else if (typeof pattern === 'string') {
                //Handling the incoming presence pattern
                if (pattern === 'presence' && Config.getConfigStatuses().usePresence) {
                    return this._usePresence(pattern, handler, ctx, next);
                }

                //Handling an incoming keyword pattern
                if (pattern.split('_')[1] === "key") {
                    return this._useKeywords(pattern.split('_key_')[1].trim(), handler, ctx, next);
                }

                //Handling an incoming string pattern
                return this._useString(pattern, handler, ctx, next);

            } else {
                //Processing an incoming function without a pattern
                return this._useEmptiness(handler, ctx, next);
            }
        });
    }

    _useEmptiness(handler: BotHandler, ctx: IBotContext, next: any) {
        if (ctx.message.data.type === "sendMessage") {
            return handler(ctx, next);
        }

        return next();
    }

    _useRegExp(pattern: RegExp | string, handler: BotHandler, ctx: IBotContext, next: any) {
        const text = ctx.message.getText();
        const match = text.match(pattern);

        if (match) {
            ctx.params = match.length > 1 ? match.slice(1) : null;
            return handler(ctx, next);
        }

        return next();
    }

    _useKeywords(keywords: string, handler: BotHandler, ctx: IBotContext, next: any) {
        if (ctx.message.filterText(keywords)) {
            return handler(ctx, next);
        } else {
            return next();
        }
    }

    _useString(pattern: RegExp | string, handler: BotHandler, ctx: IBotContext, next: any) {
        const text = ctx.message.getText();

        if (text === pattern) {
            return handler(ctx, next);
        }

        return next();
    }

    _usePresence(pattern: RegExp | string, handler: BotHandler, ctx: IBotContext, next: any) {
        if (ctx.message.data.type === "isComposing") {
            return handler(ctx, next);
        }

        return next();
    }

    _collectConfigurationData(data: IBotData): IConfigInit {
        let isAppName = typeof data.useAppName == "boolean" ? data.useAppName : true;
        let isAppImg = typeof data.useAppImg == "boolean" ? data.useAppImg : true;
        let usePresence = typeof data.usePresence == "boolean" ? data.usePresence : false;
        let useRoomsArchive = typeof data.useRoomsArchive == "boolean" ? data.useRoomsArchive : false;
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
            usePresence: usePresence,
            useRoomsArchive: useRoomsArchive
        }
    }
}