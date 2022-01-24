import {APP_TOKEN} from '../../docs/config';
import {
  CHANGE_API_MODE,
  CHANGE_TOKEN,
  CHANGE_XMPP_DOMAIN,
} from '../constants/types';

export const prodXmpp = 'dxmpp.com';
export const devXmpp = 'dev.dxmpp.com';

const initialState = {
  modes: {
    dev: 'https://app-dev.dappros.com/v1',
    prod: 'https://app.dappros.com/v1',
    qa: 'https://app-dev.dappros.com/v1',
  },
  tokens: {
    dev: APP_TOKEN,
    prod: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjYxODRmZjNiYzU0MDkzNmMwY2I3Y2M2OCIsImFwcE5hbWUiOiJFdGhvcmExIiwiYXBwRGVzY3JpcHRpb24iOiJudWxsIiwiYXBwVXJsIjoibnVsbCIsImFwcExvZ29IYXNoIjpudWxsLCJjcmVhdG9ySWQiOiI2MTg0ZmYxM2M1NDA5MzZjMGNiN2NiZmEiLCJjcmVhdGVkQXQiOiIyMDIxLTExLTA1VDA5OjU0OjAzLjQ4NloiLCJfX3YiOjAsInJhbmRvbVN0cmluZyI6IlFpaFdNcUNRNWJBQXpRWUZiODJnVlM0VFNBRTZ0cWVJamhHenU0bzFIWFNmZ0xJenB1dGU4Y2t4eXJrdGdSakMvUDJYeEVDbWNVUzAwaWk5RmgyQ25PSnd5V3VpWXFlWW50OHBOZ0hST0FDVFdIOFhybThHRjRhTVpYMUdhdkh5UWc5MEFjNjQrUzV0dW1WcjA0dk9vc1Nqd1FpeXBtKzA1QWNQYlAifSwiaWF0IjoxNjM2MTA2MDU4fQ.V9Q7uqfG6h__GI3yRD-omjYZj-eD-O2RuhWgUieboEk',
  },
  xmppDomains: {
    DOMAIN: 'dev.dxmpp.com',
    SERVICE: 'wss://dev.dxmpp.com:5443/ws',
    CONFERENCEDOMAIN: '@conference.dev.dxmpp.com',
    CONFERENCEDOMAIN_WITHOUT: 'conference.dev.dxmpp.com',
  },
  defaultUrl: 'https://app-dev.dappros.com/v1',
  defaultToken: APP_TOKEN,
};

const apiReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_API_MODE:
      return {...state, defaultUrl: state.modes[action.payload]};
    case CHANGE_TOKEN:
      return {...state, defaultToken: state.tokens[action.payload]};
    case CHANGE_XMPP_DOMAIN:
      return {
        ...state,
        xmppDomains: {
          DOMAIN: action.payload,
          SERVICE: `wss://${action.payload}:5443/ws`,
          CONFERENCEDOMAIN: '@conference.' + action.payload,
          CONFERENCEDOMAIN_WITHOUT: 'conference.' + action.payload,
        },
      };
    default:
      return state;
  }
};

export default apiReducer;
