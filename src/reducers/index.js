/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import { combineReducers } from 'redux';
import loginReducer from  './loginReducer';
import walletReducer from './walletReducer';
import searchReducer from './searchReducer';
import ChatReducer from './chatReducer';
import UsersReducer from './usersReducer';
import AccountReducer from './accountReducer';

module.exports = combineReducers({
    loginReducer,
    walletReducer,
    searchReducer,
    ChatReducer,
    UsersReducer,
    AccountReducer
})
