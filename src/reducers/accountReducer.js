import * as types from '../constants/types';

const initialState = {
    isFetching : false,
    error : false,
    errorMessage: '',  
    emailList: []
}

const accountReducer = (state = initialState, action) => {
    switch(action.type){

        case types.FETCHING_EMAIL_LIST:
            return{...state, isFetching:true, error:false, errorMessage:""}

        case types.FETCHING_EMAIL_LIST_SUCCESS:
            return{...state, isFetching:false, error:false, errorMessage:"", emailList:action.payload}

        case types.FETCHING_EMAIL_LIST_FAILURE:
            return{...state, isFetching:false, error:true, errorMessage:action.payload}

        case types.FETCHING_ADD_EMAIL_TO_LIST:
            return{...state, isFetching:true, error:false, errorMessage:""}

        case types.FETCHING_ADD_EMAIL_TO_LIST_SUCCESS:
            return{...state, isFetching:false, error:false, errorMessage:""}

        case types.FETCHING_ADD_EMAIL_TO_LIST_FAILURE:
            return{...state, isFetching:false, error:true, errorMessage:action.payload}

        case types.FETCHING_DELETE_EMAIL_FROM_LIST:
            return{...state, isFetching:true, error:false, errorMessage:""}

        case types.FETCHING_DELETE_EMAIL_FROM_LIST_SUCCESS:
            return{...state, isFetching:false, error:false, errorMessage:""}

        case types.FETCHING_DELETE_EMAIL_FROM_LIST_FAILURE:
            return{...state, isFetching:false, error:true, errorMessage:action.payload}

        case types.LOGOUT:
            return{...initialState}
        default:
            return state;
    }
}

export default accountReducer