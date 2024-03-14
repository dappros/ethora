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
