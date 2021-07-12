import * as types from '../constants/types';

const initialState={
    searchText:""
}
const searchReducer = (state = initialState, action) => {
    switch(action.type){
        case types.SEND_SEARCH_TEXT:
            return{...state, searchText:action.payload}

        case types.LOGOUT:
            return{...initialState}

        default:
            return state;
    }
}

export default searchReducer