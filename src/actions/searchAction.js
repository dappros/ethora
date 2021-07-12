import * as types from '../constants/types';

export const sendSearchText = text => ({
    type:types.SEND_SEARCH_TEXT,
    payload: text
})