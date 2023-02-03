import { ISession } from '../core/ISession';

export interface ISessionStore {
    find(key: string): Promise<ISession | null>;
    add(key: string, data: ISession): Promise<ISession>;
    destroy(key: string): Promise<any>;
}