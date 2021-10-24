/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import * as types from '../constants/types';

const initialState = {
    isFetching : false,
    error : false,
    errorMessage: '',  
    allUserList:[]
}

const usersReducer = (state = initialState, action) => {
    switch(action.type){
        case types.FETCHING_ALL_USER_SUCCESS:
            return{...state, isFetching:false, error:false, allUserList:action.payload.users}


        case types.LOGOUT:
            return{...initialState}
        default:
            return state;
    }
}

export default usersReducer
