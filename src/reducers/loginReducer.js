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
  token: null,
  loading: false,
  initialData: {
    firstName: '',
    lastName: '',
    walletAddress: '',
    photo: '',
    username: '',
    password: '',
    desc: '',
  },
  userDescription: '',
  userAvatar: '',
  anotherUserAvatar: '',
  anotherUserDescription: 'Test Desc',
  anotherUserFirstname: 'Loading',
  anotherUserLastname: '...',
  anotherUserLastSeen: {},
  anotherUserWalletAddress: '',
  isPreviousUser: false,
  wordpressAuth: {
    token: '',
    user_email: '',
    user_nicename: '',
    user_display_name: '',
  },
  pushSubscriptionData: {
    ok: false,
    subscription_info: {
      appId: '',
      country: '',
      createdAt: null,
      deviceId: '',
      deviceType: null,
      environment: 'Development',
      expiresAt: null,
      externalId: '',
      id: null,
      isSubscribed: '0',
      jid: null,
      language: 'en',
      lat: '',
      long: '',
      screenName: null,
      timezone: 0,
      updatedAt: 0,
    },
  },
  skipForever: false,
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCHING_COMMON_REQUEST:
      return {...state, isFetching: true, error: false};

    case types.FETCHING_COMMON_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
        errorMessage: action.payload,
      };

    case types.FETCHING_USER_LOGIN_SUCCESS:
      return {...state, isFetching: false, error: false, ...action.payload};

    case types.FETCHING_USER_REGISTER_SUCCESS:
      return {...state, isFetching: false, error: false};

    case types.GET_TOKEN:
      return {...state, token: action.token};

    case types.SAVE_TOKEN:
      return {...state, token: action.token};

    case types.REMOVE_TOKEN:
      return {...state, token: action.token};

    case types.INITIAL_DATA:
      return {...state, initialData: action.data};

    case types.SAVE_INITIAL_DATA:
      return {...state, initialData: action.data};

    case types.UPDATE_USER_PROFILE:
      return {
        ...state,
        userDescription: action.payload.desc,
        userAvatar: action.payload.photoURL,
      };

    case types.SET_OTHER_USER_VCARD:
      return {
        ...state,
        isFetching: false,
        error: false,
        anotherUserAvatar: action.payload.anotherUserAvatar,
        anotherUserDescription: action.payload.anotherUserDescription,
      };

    case types.SET_OTHER_USER_DETAILS:
      return {
        ...state,
        isFetching: false,
        error: false,
        ...action.payload
      };

    case types.SET_IS_PREVIOUS_USER:
      return {
        ...state,
        isFetching: false,
        error: false,
        isPreviousUser: action.payload,
      };

    case types.WORDPRESS_AUTH:
      return {...state, wordpressAuth: action.payload};

    case types.PUSH_SUBSCRIPTION:
      return {...state, pushSubscriptionData: action.payload};

    case types.SKIP_FOREVER:
      return {...state, skipForever: action.payload};

    case types.LOADING:
      return {...state, loading: action.isLoading};

    case types.CANCEL:
      return {...state, isFetching: false, error: false};

    case types.LOGOUT:
      return {...initialState};

    default:
      return state;
  }
};

export default loginReducer;
