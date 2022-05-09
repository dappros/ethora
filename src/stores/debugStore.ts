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

    setInitialState(){
        this.xmppLogs= [];
        this.apiLogs= [];
        this.debugMode= false;
        this.stores= {};
    }

    addLogsXmpp(log:any){
        this.xmppLogs = [...this.xmppLogs, log];
    }

    addLogsApi(log:any){
        this.apiLogs = [...this.apiLogs, log];
    }

    toggleDebugMode(value:boolean){
        this.debugMode = value;
    }

    clearLogs(){
        this.xmppLogs = [];
        this.apiLogs = [];
    }
}