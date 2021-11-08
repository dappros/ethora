import {
  ADD_LOG_API,
  ADD_LOG_XMPP,
  CLEAR_LOGS,
  TOGGLE_DEBUG_MODE,
} from '../constants/types';

const initialState = {
  xmppLogs: [],
  apiLogs: [],

  debugMode: false,
};
const debugReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_LOG_XMPP:
      return {...state, xmppLogs: [...state.xmppLogs, action.payload]};
    case ADD_LOG_API:
      return {...state, apiLogs: [...state.apiLogs, action.payload]};
    case TOGGLE_DEBUG_MODE:
      return {...state, debugMode: action.payload};

    case CLEAR_LOGS:
      return {...state, xmppLogs: [], apiLogs: []};

    default:
      return state;
  }
};

export default debugReducer;
