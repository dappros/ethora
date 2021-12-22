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
    dev: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjYxMTBlOTdiMWFjZWQ1MGE0ZGU3MDA0OSIsImFwcE5hbWUiOiJFdGhvcmEiLCJhcHBEZXNjcmlwdGlvbiI6InVuZGVmaW5lZCIsImFwcFVybCI6InVuZGVmaW5lZCIsImFwcExvZ29IYXNoIjpudWxsLCJjcmVhdG9ySWQiOiI2MTEwZTk2MDFhY2VkNTBhNGRlNzAwMDMiLCJjcmVhdGVkQXQiOiIyMDIxLTA4LTA5VDA4OjM4OjE5Ljk2OFoiLCJfX3YiOjAsInJhbmRvbVN0cmluZyI6IllqUzUvUmthMkNvcitFSStUNlRQUnV3ekZjNk8zZHZYaC8rRFBobHhITExKejlVaDZOSm1WcVNJQkRSYnBXSExuUEpoQzJLUDc0Y2NHZ21hKzFYUGJwcjFpNDV1RlhaeDNNMTdjZDRJTWtqS00yOS9yTERvN3IrYzdJRlpyckt0S3dsWUtwb3Nabi8yQmFEZjdISWRoWXUwdzVHaGp0VUlGcXdJKy94NFZrTyttRUtUIn0sImlhdCI6MTYyODQ5ODMwNX0.TzHlVy2bv-_gnrP9U7NyoYdNYvIBfVR9nUfH-RFg9e8',
    prod: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjYxODRmZjNiYzU0MDkzNmMwY2I3Y2M2OCIsImFwcE5hbWUiOiJFdGhvcmExIiwiYXBwRGVzY3JpcHRpb24iOiJudWxsIiwiYXBwVXJsIjoibnVsbCIsImFwcExvZ29IYXNoIjpudWxsLCJjcmVhdG9ySWQiOiI2MTg0ZmYxM2M1NDA5MzZjMGNiN2NiZmEiLCJjcmVhdGVkQXQiOiIyMDIxLTExLTA1VDA5OjU0OjAzLjQ4NloiLCJfX3YiOjAsInJhbmRvbVN0cmluZyI6IlFpaFdNcUNRNWJBQXpRWUZiODJnVlM0VFNBRTZ0cWVJamhHenU0bzFIWFNmZ0xJenB1dGU4Y2t4eXJrdGdSakMvUDJYeEVDbWNVUzAwaWk5RmgyQ25PSnd5V3VpWXFlWW50OHBOZ0hST0FDVFdIOFhybThHRjRhTVpYMUdhdkh5UWc5MEFjNjQrUzV0dW1WcjA0dk9vc1Nqd1FpeXBtKzA1QWNQYlAifSwiaWF0IjoxNjM2MTA2MDU4fQ.V9Q7uqfG6h__GI3yRD-omjYZj-eD-O2RuhWgUieboEk',
  },
  xmppDomains: {
    DOMAIN: 'dev.dxmpp.com',
    SERVICE: 'wss://dev.dxmpp.com:5443/ws',
    CONFERENCEDOMAIN: '@conference.dev.dxmpp.com',
    CONFERENCEDOMAIN_WITHOUT: 'conference.dev.dxmpp.com',
  },
  defaultUrl: 'https://app-dev.dappros.com/v1',
  defaultToken:
    'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjYxYmM2ZWMxY2VlN2Q4MGIxOWVjMmE1ZiIsImFwcE5hbWUiOiJFdGhvcmEiLCJhcHBEZXNjcmlwdGlvbiI6InVuZGVmaW5lZCIsImFwcFVybCI6InVuZGVmaW5lZCIsImFwcExvZ29IYXNoIjpudWxsLCJjcmVhdG9ySWQiOiI2MWJjNmRhY2NlZTdkODBiMTllYzI5YjciLCJjcmVhdGVkQXQiOiIyMDIxLTEyLTE3VDExOjA0OjMzLjI2M1oiLCJfX3YiOjAsInJhbmRvbVN0cmluZyI6ImZycXlyMG53b0s5UElOdE5tSkg0Q3drVERZcW5uWUdzaU1Ib0hTL2w2RTVERjZyRnM3OUNFcHVJVVJBcWcvN0lmU0VTdjFRWitVNnMrQUo3elh3UTExaUFOMkdMU2dqMkVSaXRySjMxdmxVeGpxMEZ0STlLSzRWdUVQNlFqcUFiTyJ9LCJpYXQiOjE2Mzk3MzkwODN9.Vpm-iGCS9S_v5cejAsUhOxTs29nc5O_M92fqecld3tI',
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
