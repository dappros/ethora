import {CHANGE_API_MODE} from '../constants/types';

export const changeApiMode = mode => ({
  type: CHANGE_API_MODE,
  payload: mode,
});
