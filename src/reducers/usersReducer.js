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