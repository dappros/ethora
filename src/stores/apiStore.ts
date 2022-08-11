import {makeAutoObservable, runInAction} from 'mobx';
import {APP_TOKEN} from '../../docs/config';

export class ApiStore {
  modes = {
    dev: 'https://app-dev.dappros.com/v1',
    prod: 'https://app.dappros.com/v1',
    qa: 'https://app-dev.dappros.com/v1',
  };
  tokens = {
    dev: APP_TOKEN,
    prod: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjYxODRmZjNiYzU0MDkzNmMwY2I3Y2M2OCIsImFwcE5hbWUiOiJFdGhvcmExIiwiYXBwRGVzY3JpcHRpb24iOiJudWxsIiwiYXBwVXJsIjoibnVsbCIsImFwcExvZ29IYXNoIjpudWxsLCJjcmVhdG9ySWQiOiI2MTg0ZmYxM2M1NDA5MzZjMGNiN2NiZmEiLCJjcmVhdGVkQXQiOiIyMDIxLTExLTA1VDA5OjU0OjAzLjQ4NloiLCJfX3YiOjAsInJhbmRvbVN0cmluZyI6IlFpaFdNcUNRNWJBQXpRWUZiODJnVlM0VFNBRTZ0cWVJamhHenU0bzFIWFNmZ0xJenB1dGU4Y2t4eXJrdGdSakMvUDJYeEVDbWNVUzAwaWk5RmgyQ25PSnd5V3VpWXFlWW50OHBOZ0hST0FDVFdIOFhybThHRjRhTVpYMUdhdkh5UWc5MEFjNjQrUzV0dW1WcjA0dk9vc1Nqd1FpeXBtKzA1QWNQYlAifSwiaWF0IjoxNjM2MTA2MDU4fQ.V9Q7uqfG6h__GI3yRD-omjYZj-eD-O2RuhWgUieboEk',
  };
  xmppDomains = {
    DOMAIN: 'dxmpp.com',
    SERVICE: 'wss://dxmpp.com:5443/ws',
    CONFERENCEDOMAIN: '@conference.dxmpp.com',
    CONFERENCEDOMAIN_WITHOUT: 'conference.dxmpp.com',
  };
  defaultUrl = 'https://app.dappros.com/v1';
  defaultToken = APP_TOKEN;

  constructor() {
    makeAutoObservable(this);
  }

  setInitialState() {
    runInAction(() => {
      this.modes = {
        dev: 'https://app-dev.dappros.com/v1',
        prod: 'https://app.dappros.com/v1',
        qa: 'https://app-dev.dappros.com/v1',
      };
      this.tokens = {
        dev: APP_TOKEN,
        prod: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjYxODRmZjNiYzU0MDkzNmMwY2I3Y2M2OCIsImFwcE5hbWUiOiJFdGhvcmExIiwiYXBwRGVzY3JpcHRpb24iOiJudWxsIiwiYXBwVXJsIjoibnVsbCIsImFwcExvZ29IYXNoIjpudWxsLCJjcmVhdG9ySWQiOiI2MTg0ZmYxM2M1NDA5MzZjMGNiN2NiZmEiLCJjcmVhdGVkQXQiOiIyMDIxLTExLTA1VDA5OjU0OjAzLjQ4NloiLCJfX3YiOjAsInJhbmRvbVN0cmluZyI6IlFpaFdNcUNRNWJBQXpRWUZiODJnVlM0VFNBRTZ0cWVJamhHenU0bzFIWFNmZ0xJenB1dGU4Y2t4eXJrdGdSakMvUDJYeEVDbWNVUzAwaWk5RmgyQ25PSnd5V3VpWXFlWW50OHBOZ0hST0FDVFdIOFhybThHRjRhTVpYMUdhdkh5UWc5MEFjNjQrUzV0dW1WcjA0dk9vc1Nqd1FpeXBtKzA1QWNQYlAifSwiaWF0IjoxNjM2MTA2MDU4fQ.V9Q7uqfG6h__GI3yRD-omjYZj-eD-O2RuhWgUieboEk',
      };
      this.xmppDomains = {
        DOMAIN: 'dxmpp.com',
        SERVICE: 'wss://dxmpp.com:5443/ws',
        CONFERENCEDOMAIN: '@conference.dxmpp.com',
        CONFERENCEDOMAIN_WITHOUT: 'conference.dxmpp.com',
      };
      this.defaultUrl = 'https://app.dappros.com/v1';
      this.defaultToken = APP_TOKEN;
    });
  }

  changeXmpp = () => {
    runInAction(() => {
      this.xmppDomains = {};
    });
  };
  getXmppDomains() {
    return this.xmppDomains;
  }
}
