/*

We need a multi-room persistent store with following features:

Store or refer - UserID 
Upon login, we check if current user ID = stored UserID. If not, we clean/reset the whole store.
If user ID matches then we reuse the cached store.

Messages store required fields (see also: https://github.com/dappros/ethora/blob/main/api/chats.md XMPP stanza contents) 
[ roomJID ] [ msgID (aka timestamp) ] [ senderJID ] [firstName] [lastName] [ msgText ] [ msgType = 'system' or default if not defined ] [msgData]

 note: most of these fields are already inside message stanza text, but we extract and store them into store 

*/


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
