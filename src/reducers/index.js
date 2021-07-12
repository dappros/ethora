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