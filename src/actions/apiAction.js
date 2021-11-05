import {
  CHANGE_API_MODE,
  CHANGE_TOKEN,
  CHANGE_XMPP_DOMAIN,
} from '../constants/types';

export const changeApiMode = mode => ({
  type: CHANGE_API_MODE,
  payload: mode,
});
export const changeToken = token => ({
  type: CHANGE_TOKEN,
  payload: token,
});
export const changeXmpp = xmppDomain => ({
  type: CHANGE_XMPP_DOMAIN,
  payload: xmppDomain,
});
