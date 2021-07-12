import * as types from '../constants/types';

const initialState = {
    isFetching : false,
    error : false,
    errorMessage: '',  
    transactions:[],
    anotherUserTransaction: [],
    anotherUserBalance: [],
    balance:[],
    tokenTransferSuccess:
    {
        success:false, 
        senderName:"",
        receiverName:"",
        amount:0,
        receiverMessageId:""
    }
}

const walletReducer = (state = initialState, action) => {
    switch(action.type) {
        case types.FETCHING_TOKEN_ETHER_BALANCE_SUCCESS:
            return {...state, isFetching: false, error:false,balance:action.payload.balance}

        case types.TOKEN_TRANSFER_SUCCESS:
            return {...state, isFetching:false, error:false, tokenTransferSuccess:action.payload}

        case types.FETCHING_TRANSACTION_SUCCESS:
            return {...state, isFetching:false, error:false, transactions:action.payload.transactions}

        case types.FETCHING_OTHER_USER_TRANSACTION_SUCCESS:
            return {...state, isFetching:false, error:false, anotherUserTransaction:action.payload.transactions}

        case types.FETCHING_OTHER_USER_TOKEN_BALANCE_SUCCESS:
            return {...state, isFetching:false, error:false, anotherUserBalance:action.payload.balance}

        case types.FETCHING_WALLET_COMMON_REQUEST:
            return {...state, isFetching:true, error: false}

        case types.FETCHING_WALLET_COMMON_FAILURE:
            return {...state, isFetching:false, error:true, errorMessage:action.payload}
        
        case types.LOGOUT:
            return{...initialState}
        default:
            return state;
    }
}

export default walletReducer