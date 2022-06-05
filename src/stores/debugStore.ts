import {makeAutoObservable, runInAction} from 'mobx';
import { RootStore } from './context';

export class DebugStore{
    xmppLogs:any= [];
    apiLogs:any= [];
    debugMode:boolean= false;
    stores: RootStore|{}= {};

    constructor(stores:any){
        makeAutoObservable(this);
        this.stores = stores;
    }

    setInitialState(){
        runInAction(()=>{
            this.xmppLogs= [];
            this.apiLogs= [];
            this.debugMode= false;
        })
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