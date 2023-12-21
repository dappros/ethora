import { makeAutoObservable, runInAction } from "mobx"
import { RootStore } from "./context"

export class DebugStore {
  xmppLogs: any = []
  apiLogs: any = []
  debugMode = false
  stores: RootStore | {} = {}

  constructor(stores: any) {
    makeAutoObservable(this)
    this.stores = stores
  }

  setInitialState() {
    runInAction(() => {
      this.xmppLogs = []
      this.apiLogs = []
      this.debugMode = false
    })
  }

  addLogsXmpp(log: any) {
    runInAction(() => {
      this.xmppLogs.push(log)
    })
  }

  addLogsApi(log: any) {
    runInAction(() => {
      this.apiLogs.push(log)
    })
  }

  toggleDebugMode(value: boolean) {
    this.debugMode = value
  }

  clearLogs() {
    this.xmppLogs = []
    this.apiLogs = []
  }
}
