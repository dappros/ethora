/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import {createStore,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger' 
import reducer from "../reducers";

const logger = createLogger({
    predicate: (getState, action) => __DEV__});

const createStoreWithMiddleware = applyMiddleware(thunk,logger)(createStore);

const store = createStoreWithMiddleware(reducer);

export default store;
