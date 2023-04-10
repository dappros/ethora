import * as dotenv from 'dotenv'
import path from 'path'
import {IBotInit, IConfig, IConfigData} from "./IConfig";

dotenv.config({path: path.join(__dirname, '../../.env')})

export class Config implements IConfig {
    private data: IConfigData = {
        token: '',
        username: '',
        password: '',
        avatar: '',
        rooms: [],
    };

    constructor() {
        if (!process.env.USERNAME && !process.env.PASSWORD && !process.env.TOKEN) {
            throw new Error('Required fields in env file not filled.')
        }
        this.data.token = process.env.TOKEN;
        this.data.username = process.env.APP_USERNAME;
        this.data.password = process.env.PASSWORD;
        this.data.avatar = process.env.AVATAR ? process.env.AVATAR : '';
        this.data.rooms = process.env.ROOMS ? process.env.ROOMS.split(',') : [];
    }

    get getConfigData(): IConfigData {
        return this.data;
    }

    get getBotInitData(): IBotInit {
        return {
            username: this.data.username,
            password: this.data.password,
            tokenJWT: this.data.token,
            botName: this.data.username,
            botImg: this.data.avatar,
            useTyping: true,
            useNameInMsg: false,
            connectionRooms: this.data.rooms
        }
    }
}