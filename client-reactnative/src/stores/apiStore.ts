import { makeAutoObservable, runInAction } from "mobx"
import {
  APP_TOKEN,
  IAPImodes,
  IxmppEndpoints,
  apiModes,
  appEndpoint,
  xmppEndpoints,
} from "../../docs/config"

export class ApiStore {
  tokens = {
    dev: APP_TOKEN,
    prod: "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjYxODRmZjNiYzU0MDkzNmMwY2I3Y2M2OCIsImFwcE5hbWUiOiJFdGhvcmExIiwiYXBwRGVzY3JpcHRpb24iOiJudWxsIiwiYXBwVXJsIjoibnVsbCIsImFwcExvZ29IYXNoIjpudWxsLCJjcmVhdG9ySWQiOiI2MTg0ZmYxM2M1NDA5MzZjMGNiN2NiZmEiLCJjcmVhdGVkQXQiOiIyMDIxLTExLTA1VDA5OjU0OjAzLjQ4NloiLCJfX3YiOjAsInJhbmRvbVN0cmluZyI6IlFpaFdNcUNRNWJBQXpRWUZiODJnVlM0VFNBRTZ0cWVJamhHenU0bzFIWFNmZ0xJenB1dGU4Y2t4eXJrdGdSakMvUDJYeEVDbWNVUzAwaWk5RmgyQ25PSnd5V3VpWXFlWW50OHBOZ0hST0FDVFdIOFhybThHRjRhTVpYMUdhdkh5UWc5MEFjNjQrUzV0dW1WcjA0dk9vc1Nqd1FpeXBtKzA1QWNQYlAifSwiaWF0IjoxNjM2MTA2MDU4fQ.V9Q7uqfG6h__GI3yRD-omjYZj-eD-O2RuhWgUieboEk",
  }
  xmppDomains = {
    DOMAIN: xmppEndpoints[appEndpoint as keyof IxmppEndpoints].DOMAIN,
    SERVICE: xmppEndpoints[appEndpoint as keyof IxmppEndpoints].SERVICE,
    CONFERENCEDOMAIN:
      xmppEndpoints[appEndpoint as keyof IxmppEndpoints].CONFERENCEDOMAIN,
    CONFERENCEDOMAIN_WITHOUT:
      xmppEndpoints[appEndpoint as keyof IxmppEndpoints]
        .CONFERENCEDOMAIN_WITHOUT,
  }
  pushURL = xmppEndpoints[appEndpoint as keyof IxmppEndpoints].DOMAIN
  defaultUrl = apiModes[appEndpoint as keyof IAPImodes]
  defaultToken = APP_TOKEN

  constructor() {
    makeAutoObservable(this)
  }

  setInitialState() {
    runInAction(() => {
      this.xmppDomains = {
        DOMAIN: xmppEndpoints[appEndpoint as keyof IxmppEndpoints].DOMAIN,
        SERVICE: xmppEndpoints[appEndpoint as keyof IxmppEndpoints].SERVICE,
        CONFERENCEDOMAIN:
          xmppEndpoints[appEndpoint as keyof IxmppEndpoints].CONFERENCEDOMAIN,
        CONFERENCEDOMAIN_WITHOUT:
          xmppEndpoints[appEndpoint as keyof IxmppEndpoints]
            .CONFERENCEDOMAIN_WITHOUT,
      }
      this.defaultUrl = apiModes[appEndpoint as keyof IAPImodes]
      this.defaultToken = APP_TOKEN
    })
  }

  changeXmpp = () => {
    runInAction(() => {
      this.xmppDomains = {
        DOMAIN: "",
        SERVICE: "",
        CONFERENCEDOMAIN: "",
        CONFERENCEDOMAIN_WITHOUT: "",
      }
    })
  }
  getXmppDomains() {
    return this.xmppDomains
  }
}
