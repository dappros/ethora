import {CHANGE_API_MODE} from '../constants/types';

const initialState = {
  modes: {
    dev: 'https://app-dev.dappros.com/v1',
    prod: 'hello',
    qa: 'https://app-dev.dappros.com/v1',
  },

  defaultUrl: 'https://app-dev.dappros.com/v1',
};
const apiReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_API_MODE:
      return {...state, defaultUrl: state.modes[action.payload]};
    default:
      return state;
  }
};

export default apiReducer;
