// 
//  We need a multi-room persistent store with following features:
//  Store or refer - UserID 
//  Upon login, we check if current user ID = stored UserID. If not, we clean/reset the whole store.
//  If user ID matches then we reuse the cached store.
//  
//  [ room JID ] [ messageID = timestamp ] [ message stanza text ] [ message type = system or default ] 
//
//

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMessage, UserType } from "../types/types";

interface ChatState {
  messages: IMessage[];
}

const initialState: ChatState = {
  messages: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<IMessage | UserType>) => {
      state.messages.push(action.payload);
    },
    addMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.messages.push(...action.payload);
    },
    setMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.messages = action.payload;
    },
  },
});

export const { addMessage, setMessages, addMessages } = chatSlice.actions;

export default chatSlice.reducer;
