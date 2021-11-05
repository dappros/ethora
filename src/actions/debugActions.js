import {ADD_LOG_API, ADD_LOG_XMPP, TOGGLE_DEBUG_MODE} from '../constants/types';

export const addLogsXmpp = log => ({
  type: ADD_LOG_XMPP,
  payload: log,
});
export const addLogsApi = log => ({
  type: ADD_LOG_API,
  payload: log,
});

export const toggleDebugMode = value => ({
  type: TOGGLE_DEBUG_MODE,
  payload: value,
});
