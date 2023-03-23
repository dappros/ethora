import { ISessionStore } from './ISessionStore';
import { Session } from '../core/Session';

export default class MemorySessionStore implements ISessionStore {
    private store: { [key: string]: Session } = {};

    async find(key: string) {
        return Promise.resolve(this.store[key]);
    }

    async add(key: string, data: Session) {
        this.store[key] = data;

        return Promise.resolve(data);
    }

    async destroy(key: string) {
        delete this.store[key];
        return Promise.resolve();
    }
}