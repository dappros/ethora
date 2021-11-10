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
    dev: '<Include your JWT token string here starting with "JWT " obtained after creating your Application at https://app-dev.dappros.com/>',
    prod: '<Include your JWT token string here starting with "JWT " obtained after creating your Application at https://app.dappros.com/>',
  },
  xmppDomains: {
    DOMAIN: 'dev.dxmpp.com',
    SERVICE: 'wss://dev.dxmpp.com:5443/ws',
    CONFERENCEDOMAIN: '@conference.dev.dxmpp.com',
    CONFERENCEDOMAIN_WITHOUT: 'conference.dev.dxmpp.com',
  },
  defaultUrl: 'https://app-dev.dappros.com/v1',
  defaultToken:
    '<Include your JWT token string here starting with "JWT " obtained after creating your Application at https://app-dev.dappros.com/>',
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
