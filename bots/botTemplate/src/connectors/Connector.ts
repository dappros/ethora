import EventEmitter = require("events");
import {IConnector} from "./IConnector";
import {IUser} from "../core/IUser";
import {IMessage} from "../core/IMessage";

export default class Connector extends EventEmitter implements IConnector {
    static _getUser(): IUser {
        return {jid: 'user', firstName: 'UserFirst', lastName: 'UserLast'};
    }

    getConnectorName(): string {
        return 'console';
    }

    getUniqueSessionKey() {
        return this.getConnectorName();
    }

    async getUser(): Promise<IUser> {
        return Promise.resolve(Connector._getUser());
    }

    async send(message: IMessage) {
        //sendMessage Logic
        console.log(message.getText());

        return Promise.resolve();
    }

    // listen() {
    //     /* Создаем интерфейс для чтения stdin потока */
    //     const rl = readline.createInterface(process.stdin, process.stdout);
    //
    //     rl.on('line', (line: string = '') => {
    //         /* Если пользователь ввел quit, завершаем работу бота */
    //         if (line.toLowerCase() === 'quit') {
    //             rl.close();
    //             process.exit();
    //         }
    //
    //         const msg = new Message({
    //             rawData: { text: line },
    //             user: ConsoleConnector._getUser(),
    //             sessionKey: this.getUniqueSessionKey(),
    //             sender: MessageSender.user
    //         });
    //
    //         /* Эммитим созданное сообщение (Bot случает событие receiveMessage,
    //            поэтому сразу после вызыва начинает обрабатывать сообщение */
    //         this.emit(ConnectorEvent.receiveMessage, msg);
    //     });
    //
    //     return this;
    // }
}

// const Teset = new Connector();
// Teset.