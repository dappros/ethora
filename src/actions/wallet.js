/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import * as types from '../constants/types';
import * as connectionURL from '../config/url';
import fetchFunction from '../config/api';
import {insertTransaction} from '../components/realmModels/transaction';
import {logOut} from './auth';
import {Alert} from 'react-native';
import {addLogsApi} from './debugActions';
import store from '../config/store';
import {
  etherTransferURL,
  itemTransferURL,
  tokenEtherBalanceURL,
  tokenTransferURL,
  transactionURL,
} from '../config/routesConstants';

const hitAPI = new fetchFunction();

const getUrlFromStore = additionalUrl => {
  return store.getState().apiReducer.defaultUrl + additionalUrl;
};

export const fetchingWalletCommonRequest = () => ({
  type: types.FETCHING_WALLET_COMMON_REQUEST,
});

export const setOffset = offset => ({
  type: types.SET_OFFSET,
  payload: offset,
});
export const setTotal = total => ({
  type: types.SET_TOTAL,
  payload: total,
});
export const clearPaginationData = () => ({
  type: types.CLEAR_PAGINATION_DATA,
});

export const fetchingWalletCommonFailure = errorMsg => ({
  type: types.FETCHING_WALLET_COMMON_FAILURE,
  payload: errorMsg,
});

export const fetchTokenEtherBalance = data => ({
  type: types.FETCHING_TOKEN_ETHER_BALANCE_SUCCESS,
  payload: data,
});

export const fetchingOtherUserTokenBalance = data => ({
  type: types.FETCHING_OTHER_USER_TOKEN_BALANCE_SUCCESS,
  payload: data,
});

export const transferTokensSuccess = data => ({
  type: types.TOKEN_TRANSFER_SUCCESS,
  payload: data,
});

export const fetchingTransactionSuccess = data => ({
  type: types.FETCHING_TRANSACTION_SUCCESS,
  payload: data,
});

export const fetchingOtherUserTransactionSuccess = data => ({
  type: types.FETCHING_OTHER_USER_TRANSACTION_SUCCESS,
  payload: data,
});

export const cancel = () => ({
  type: types.CANCEL,
});

const getTokenBalanceURL = (walletAddress, tokenName) => {
  // let modifiedURL = connectionURL.tokenEtherBalanceURL + walletAddress;
  let modifiedURL = getUrlFromStore(tokenEtherBalanceURL) + walletAddress;

  return modifiedURL;
};

export const fetchWalletBalance = (walletAddress, tokenName, token, isOwn) => {
  let url = getTokenBalanceURL(walletAddress, tokenName);
  return dispatch => {
    dispatch(fetchingWalletCommonRequest());
    try {
      hitAPI.fetchGet(
        url,
        token,
        () => {
          dispatch(logOut());
        },
        data => {
          dispatch(addLogsApi(data));

          if (data.success === true) {
            console.log(data, 'asjkdkasdjlaks');
            if (isOwn) {
              dispatch(fetchTokenEtherBalance(data));
            } else {
              dispatch(fetchingOtherUserTokenBalance(data));
            }
          } else {
            console.log(data);
            dispatch(fetchingWalletCommonFailure(data));
          }
        },
      );
    } catch (error) {
      console.log(error);
      dispatch(fetchingWalletCommonFailure('Something went wrong'));
    }
  };
};

export const transferTokens = (
  bodyData,
  token,
  fromWallet,
  senderName,
  receiverName,
  receiverMessageId,
  itemUrl,
) => {
  let url = '';
  if (bodyData.tokenName && !itemUrl) {
    url = getUrlFromStore(tokenTransferURL);
  } else if (itemUrl) {
    url = getUrlFromStore(itemTransferURL);
  } else {
    url = getUrlFromStore(etherTransferURL);
  }
  if (bodyData.nftId) {
    console.log(bodyData.tokenName, 'tokenjsdkfhdksjf');
    Alert.alert(
      'Item transfer',
      `You have successfully sent ${bodyData.tokenName}. After confirming the blockchain transaction, it will appear in the recipient's profile.`,
      [{text: 'Ok', onPress: () => console.log('ok')}],
    );
  }
  return dispatch => {
    dispatch(fetchingWalletCommonRequest());
    try {
      hitAPI.fetchPost(
        url,
        bodyData,
        token,
        async () => {
          dispatch(logOut());
        },
        async data => {
          dispatch(addLogsApi(data));
          if (data.success) {
            dispatch(
              transferTokensSuccess({
                success: true,
                senderName,
                receiverName,
                amount: bodyData.amount,
                receiverMessageId: receiverMessageId,
                tokenName: bodyData.tokenName,
              }),
            );
            dispatch(fetchWalletBalance(fromWallet, null, token, true));
          } else {
            dispatch(fetchingWalletCommonFailure(data.msg));
          }
        },
      );
    } catch (error) {
      dispatch(fetchingWalletCommonFailure(error));
    }
  };
};

export const fetchTransaction = (
  walletAddress,
  token,
  isOwn,
  limit = 10,
  offset = 0,
) => {
  let url =
    getUrlFromStore(transactionURL) +
    'walletAddress=' +
    walletAddress +
    `&limit=${limit}&offset=${offset}`;
  // let url = connectionURL.transactionURL
  return dispatch => {
    // dispatch(fetchingWalletCommonRequest());
    try {
      walletAddress &&
        hitAPI.fetchGet(
          url,
          token,
          () => {
            dispatch(logOut());
          },
          data => {
            dispatch(addLogsApi(data));
            if (data.items) {
              if (isOwn) {
                dispatch(setOffset(data.limit));
                dispatch(setTotal(data.total));
                dispatch(fetchingTransactionSuccess(data));
                insertTransaction(data.items);
              } else {

                dispatch(setOffset(data.limit));
                dispatch(setTotal(data.total));
                dispatch(fetchingOtherUserTransactionSuccess(data));
              }
            } else {
              dispatch(fetchingWalletCommonFailure(data));
            }
          },
        );
    } catch (error) {
      dispatch(fetchingWalletCommonFailure(error));
    }
  };
};
