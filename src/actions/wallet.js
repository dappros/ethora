import * as types from '../constants/types';
import * as connectionURL from '../config/url';
import fetchFunction from '../config/api';
import {insertTransaction} from '../components/realmModels/transaction';
import {logOut} from './auth';

const hitAPI = new fetchFunction
 
export const fetchingWalletCommonRequest = () => ({
    type: types.FETCHING_WALLET_COMMON_REQUEST,
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
    payload: data
})

export const transferTokensSuccess = (data) => ({
    type:types.TOKEN_TRANSFER_SUCCESS,
    payload: data
})

export const fetchingTransactionSuccess = data => ({
    type: types.FETCHING_TRANSACTION_SUCCESS,
    payload: data,
});

export const fetchingOtherUserTransactionSuccess = data => ({
    type: types.FETCHING_OTHER_USER_TRANSACTION_SUCCESS,
    payload: data
})

export const cancel = () => ({
    type: types.CANCEL,
});


const getTokenBalanceURL=(walletAddress,tokenName)=>{
    let modifiedURL = connectionURL.tokenEtherBalanceURL +walletAddress;
    return modifiedURL
}

export const fetchWalletBalance = (walletAddress, tokenName, token, isOwn) => {
    let url = getTokenBalanceURL(walletAddress, tokenName)
    return dispatch => {
        dispatch(fetchingWalletCommonRequest());
        try{
            hitAPI.fetchGet(url, token,()=>{
                dispatch(logOut());
            }, data =>{
                if(data.success === true){
                    if(isOwn){
                        dispatch(fetchTokenEtherBalance(data));
                    }
                    else{
                        dispatch(fetchingOtherUserTokenBalance(data))
                    }
                }else{
                    console.log(data)
                    dispatch(fetchingWalletCommonFailure(data));
                }
            });
        } catch (error){
            console.log(error);
            dispatch(fetchingWalletCommonFailure('Something went wrong'));
        }
    }
}

export const transferTokens = (bodyData,token, fromWallet, senderName, receiverName, receiverMessageId) => {
    let url = ""
    if(bodyData.tokenName){
        url = connectionURL.tokenTransferURL;
    }else{
        url = connectionURL.etherTransferURL;
    }
    return dispatch=> {
        dispatch(fetchingWalletCommonRequest());
        try{
            hitAPI.fetchPost(url, bodyData, token, async() => {
                dispatch(logOut());
            }, async data=>{
                if(data.success){
                    await dispatch(fetchWalletBalance(fromWallet,null,token, true))
                    dispatch(transferTokensSuccess({success:true, senderName, receiverName, amount:bodyData.amount, receiverMessageId:receiverMessageId}))
                }else{
                    dispatch(fetchingWalletCommonFailure(data));
                }
            })
        }catch(error){
            dispatch(fetchingWalletCommonFailure(error));
        }
    }
}

export const fetchTransaction = (walletAddress, token, isOwn) => {
    let url = connectionURL.transactionURL+"walletAddress="+walletAddress
    // let url = connectionURL.transactionURL
    return dispatch => {
        dispatch(fetchingWalletCommonRequest());
        try{
            hitAPI.fetchGet(url, token, ()=>{
                dispatch(logOut());
            }, (data) =>{
                if(data.success){

                    if(isOwn){
                        insertTransaction(data.transactions);
                        dispatch(fetchingTransactionSuccess(data));
                    }else{
                        dispatch(fetchingOtherUserTransactionSuccess(data));
                    }
                    
                }else{
                    dispatch(fetchingWalletCommonFailure(data));
                }
            })
        }catch(error){
            dispatch(fetchingWalletCommonFailure(error));
        }
    }
}