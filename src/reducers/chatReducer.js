import * as types from '../constants/types';

const initialState = {
    chatRoomDetails:{
        chat_id:"",
        chat_name:""
    },
    isRoom:false,
    rosterList:[],
    recentRealtimeChat:{
        avatar:"",
        createdAt:"",
        message_id:"",
        name:"",
        room_name:"",
        text:"",
        user_id:"",
        system:false,
        shouldUpdateChatScreen:true
    },
    finalMessageArrived:false,
    shouldCount: true,
    participantsUpdate:false,
    isRosterUpdated:false,
    tokenAmountUpdate:false,
    pushData:{msgId:"",mucId:""},
    isComposing:{state:false,username:""}
}

const chatReducer = (state=initialState, action) => {
    switch(action.type){
        case types.FETCH_CHAT_HEADER:
            return {...state, chatRoomDetails:action.payload}

        case types.IS_ROOM_CREATED:
            return {...state, isRoom:action.payload}

        case types.SET_ROSTER:
            return {...state, rosterList:action.payload}

        case types.UPDATED_ROASTER:
            return {...state, isRosterUpdated:action.payload}
    

        case types.SET_RECENT_REALTIME_CHAT:
            return {...state, recentRealtimeChat:action.payload}

        case types.FINAL_MESSAGE_ARRIVED:
            return {...state, finalMessageArrived:action.payload}

        case types.SHOULD_COUNT:
            return {...state, shouldCount:action.payload}

        case types.PARTICIPANT_UPDATE:
            return {...state, participantsUpdate:action.payload}

        case types.TOKEN_AMOUNT_UPDATE:
            return {...state, tokenAmountUpdate:action.payload}

        case types.SET_PUSH_DATA:
            return {...state, pushData:action.payload}

        case types.UPDATE_MESSAGE_COMPOSING_STATE:
            return {...state, isComposing:action.payload}

        case types.LOGOUT:
            return{...initialState}
        default:
            return state;
    }
}

export default chatReducer