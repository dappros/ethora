/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import * as types from '../constants/types';
import fetchFunction from '../config/api';
import {httpDelete, httpGet, httpPost} from '../config/apiService';
import {showSuccess} from '../config/toastAction';
import store from '../config/store';
import {addOrDeleteEmail, getListOfEmails} from '../config/routesConstants';

const getUrlFromStore = additionalUrl => {
  return store.getState().apiReducer.defaultUrl + additionalUrl;
};
const fetchingEmailList = () => ({
  type: types.FETCHING_EMAIL_LIST,
});

const fetchingEmailListFailure = errorMsg => ({
  type: types.FETCHING_EMAIL_LIST_FAILURE,
  payload: errorMsg,
});

const fetchingEmailListSuccess = data => ({
  type: types.FETCHING_EMAIL_LIST_SUCCESS,
  payload: data,
});

const fetchingAddEmailToList = () => ({
  type: types.FETCHING_ADD_EMAIL_TO_LIST,
});

const fetchingAddEmailToListFailure = errorMsg => ({
  type: types.FETCHING_ADD_EMAIL_TO_LIST_FAILURE,
  payload: errorMsg,
});

const fetchingAddEmailToListSuccess = message => ({
  type: types.FETCHING_ADD_EMAIL_TO_LIST_SUCCESS,
  payload: message,
});

const fetchingDeleteEmailFromList = () => ({
  type: types.FETCHING_DELETE_EMAIL_FROM_LIST,
});

const fetchingDeleteEmailFromListSuccess = message => ({
  type: types.FETCHING_DELETE_EMAIL_FROM_LIST_SUCCESS,
  payload: message,
});

const fetchingDeleteEmailFromListFailure = errorMsg => ({
  type: types.FETCHING_DELETE_EMAIL_FROM_LIST_FAILURE,
  payload: errorMsg,
});

export const getEmailList = token => {
  const url = getUrlFromStore(getListOfEmails);

  return async dispatch => {
    dispatch(fetchingEmailList());
    try {
      const res = await httpGet(url, token);
      if (res.data.success) {
        dispatch(fetchingEmailListSuccess(res.data.emails));
      } else {
        dispatch(fetchingEmailListFailure(res.data));
      }
    } catch (error) {
      dispatch(fetchingEmailListFailure(error));
    }
  };
};

export const addEmailToList = (token, body) => {
  const url = getUrlFromStore(addOrDeleteEmail);
  return async dispatch => {
    dispatch(fetchingAddEmailToList());
    try {
      const res = await httpPost(url, body, token);
      if (res.data.success || res.data === '') {
        dispatch(getEmailList(token));
        dispatch(fetchingAddEmailToListSuccess('Email Added'));
        showSuccess('Success', 'Email added successfully');
      } else {
        dispatch(fetchingAddEmailToListFailure(res.data.msg));
      }
    } catch (error) {
      dispatch(fetchingAddEmailToListFailure(error));
    }
  };
};

export const deletEmailFromList = (token, email) => {
  const url = getUrlFromStore(addOrDeleteEmail) + '/' + email;
  // const url = connectionURL.addOrDeleteEmail + '/' + email;
  return async dispatch => {
    dispatch(fetchingDeleteEmailFromList());

    try {
      const res = await httpDelete(url, token);
      if (res.data.success) {
        dispatch(getEmailList(token));
        dispatch(fetchingDeleteEmailFromListSuccess('Email Added'));
        showSuccess('Success', 'Email deleted successfully');
      } else {
        dispatch(fetchingDeleteEmailFromListFailure(res.data.msg));
      }
    } catch (error) {
      console.log(error.response);

      dispatch(fetchingDeleteEmailFromListFailure(error));
    }
  };
};
