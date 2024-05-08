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
    addMessage: (state, action: PayloadAction<IMessage>) => {
      state.messages.push(action.payload);
    },
    addMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.messages.push(...action.payload);
    },
    setMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.messages = action.payload;
    },
    resetMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, setMessages, addMessages, resetMessages } =
  chatSlice.actions;

export default chatSlice.reducer;
