/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import * as types from '../constants/types';
import * as connectionURL from '../config/url'
import fetchFunction from '../config/api'
import {logOut} from '../actions/auth';

const hitAPI = new fetchFunction

const fetchingEmailList = () =>({
    type:types.FETCHING_EMAIL_LIST
})

const fetchingEmailListFailure = errorMsg =>({
    type:types.FETCHING_EMAIL_LIST_FAILURE,
    payload:errorMsg
})

const fetchingEmailListSuccess = data => ({
    type:types.FETCHING_EMAIL_LIST_SUCCESS,
    payload:data
})

const fetchingAddEmailToList = () => ({
    type:types.FETCHING_ADD_EMAIL_TO_LIST
})

const fetchingAddEmailToListFailure = errorMsg => ({
    type:types.FETCHING_ADD_EMAIL_TO_LIST_FAILURE,
    payload:errorMsg
})

const fetchingAddEmailToListSuccess = message =>({
    type:types.FETCHING_ADD_EMAIL_TO_LIST_SUCCESS,
    payload:message
})

const fetchingDeleteEmailFromList = () => ({
    type:types.FETCHING_DELETE_EMAIL_FROM_LIST,
})

const fetchingDeleteEmailFromListSuccess = message => ({
    type:types.FETCHING_DELETE_EMAIL_FROM_LIST_SUCCESS,
    payload:message
})

const fetchingDeleteEmailFromListFailure = errorMsg => ({
    type: types.FETCHING_DELETE_EMAIL_FROM_LIST_FAILURE,
    payload:errorMsg
})

export const getEmailList = (token) => {
    return dispatch => {
        dispatch(fetchingEmailList())
        try{
            hitAPI.fetchGet(connectionURL.getListOfEmails, token, ()=>{
                dispatch(logOut());
            }, data=>{
                if(data.success){
                    dispatch(fetchingEmailListSuccess(data.emails))
                }else{
                    dispatch(fetchingEmailListFailure(data))
                }
            })
        }catch(error){
            dispatch(fetchingEmailListFailure(error));
        }
    }
}

export const addEmailToList = (token,body) => {
    return dispatch => {
        dispatch(fetchingAddEmailToList())
        try{
            hitAPI.fetchPost(connectionURL.addOrDeleteEmail, body, token, () => {
                dispatch(logOut());
            }, data=>{
                console.log(data,"addemaildata")
                if(data.success||data===""){
                    dispatch(fetchingAddEmailToListSuccess("Email Added"));
                }else{
                    dispatch(fetchingAddEmailToListFailure(data.msg));
                }
            })
        }catch(error){
            dispatch(fetchingAddEmailToListFailure(error));
        }
    }
}

export const deletEmailFromList = (token, email) => {
    const url = connectionURL.addOrDeleteEmail +"/"+ email
    return dispatch => {
        dispatch(fetchingDeleteEmailFromList())
        try{
            hitAPI.fetchDelete(url, token, ()=>{
                dispatch(logOut());
            }, data=>{
                console.log(data,"deleteDAta")
                if(data.success){
                    dispatch(fetchingDeleteEmailFromListSuccess("Email Added"));
                }else{
                    dispatch(fetchingDeleteEmailFromListFailure(data.msg));
                }
            })
        }catch(error){
            dispatch(fetchingDeleteEmailFromListFailure(error));
        }
    }
}
