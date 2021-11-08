/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import * as types from '../constants/types';

const initialState = {
  isFetching: false,
  error: false,
  errorMessage: '',
  transactions: [],
  anotherUserTransaction: [],
  anotherUserBalance: [],
  balance: [],
  offset: 0,
  limit: 10,
  total: 0,
  tokenTransferSuccess: {
    success: false,
    senderName: '',
    receiverName: '',
    amount: 0,
    receiverMessageId: '',
  },
};

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCHING_TOKEN_ETHER_BALANCE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: false,
        balance: action.payload.balance,
      };

    case types.TOKEN_TRANSFER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: false,
        tokenTransferSuccess: action.payload,
      };

    case types.FETCHING_TRANSACTION_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: false,
        transactions: [...state.transactions, ...action.payload.items],
      };

    case types.FETCHING_OTHER_USER_TRANSACTION_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: false,
        anotherUserTransaction: [
          ...state.anotherUserTransaction,
          ...action.payload.items,
        ],
      };

    case types.FETCHING_OTHER_USER_TOKEN_BALANCE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: false,
        anotherUserBalance: action.payload.balance,
      };

    case types.FETCHING_WALLET_COMMON_REQUEST:
      return {...state, isFetching: true, error: false};
    case types.SET_OFFSET:
      return {...state, offset: state.offset + action.payload};
    case types.SET_TOTAL:
      return {...state, total: action.payload};
    case types.CLEAR_PAGINATION_DATA:
      return {
        ...state,
        offset: 0,
        limit: 10,
        total: 0,
        anotherUserTransaction: [],
      };

    case types.FETCHING_WALLET_COMMON_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
        errorMessage: action.payload,
      };

    case types.LOGOUT:
      return {...initialState};
    default:
      return state;
  }
};

export default walletReducer;
