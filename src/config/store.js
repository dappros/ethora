import {createStore,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger' 
import reducer from "../reducers";

const logger = createLogger({
    predicate: (getState, action) => __DEV__});

const createStoreWithMiddleware = applyMiddleware(thunk,logger)(createStore);

const store = createStoreWithMiddleware(reducer);

export default store;