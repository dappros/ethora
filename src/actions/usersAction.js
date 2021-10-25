/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import * as types from '../constants/types';
import * as connectionURL from '../config/url'
import fetchFunction from '../config/api'
import {logOut} from './auth';

const hitAPI = new fetchFunction()

export const fetchingCommonRequest = () => ({
    type: types.FETCHING_COMMON_REQUEST,
});

export const fetchingAllUserSuccess = () => ({
    type: types.FETCHING_ALL_USER_SUCCESS,
});

export const fetchingCommonFailure = errorMsg => ({
    type: types.FETCHING_COMMON_FAILURE,
    payload: errorMsg,
});

export const fetchUsers = (token) => {
    let url = connectionURL.allUserList
    return dispatch => {
        dispatch(fetchingCommonRequest());
        try{
            hitAPI.fetchGet(url, token, ()=>{
                dispatch(logOut());
            }, data =>{
                // console.log(data)
                if(data.success){
                    dispatch(fetchingAllUserSuccess(data));
                }else{
                    dispatch(fetchingCommonFailure(data))
                }
            })
        }catch(error){
            dispatch(fetchingCommonFailure(error));
        }
    }
}
