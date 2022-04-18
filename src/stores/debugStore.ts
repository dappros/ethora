import {makeAutoObservable} from 'mobx';

export class DebugStore{
    xmppLogs= [];
    apiLogs= [];
    debugMode= false;
    stores= {};

    constructor(stores:any){
        makeAutoObservable(this);
        this.stores = stores;
    }

    addLogsXmpp(log){
        this.xmppLogs = [...this.xmppLogs, log];
    }

    addLogsApi(log){
        this.apiLogs = [...this.apiLogs, log];
    }

    toggleDebugMode(value){
        this.debugMode = value;
    }

    clearLogs(){
        this.xmppLogs = [];
        this.apiLogs = [];
    }
}