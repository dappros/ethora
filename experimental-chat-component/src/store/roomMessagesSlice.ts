import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMessage } from "../types/types";

interface RoomMessagesState {
  [key: string]: IMessage[];
}

const initialState: RoomMessagesState = {};

export const roomMessagesSlice = createSlice({
  name: "roomMessages",
  initialState,
  reducers: {
    setMessages(
      //sets messages as an array
      state,
      action: PayloadAction<{ key: string; messages: IMessage[] }>
    ) {
      const { key, messages } = action.payload;
      state[key] = messages;
    },
    addMessage(
      //adds 1 message to array
      state,
      action: PayloadAction<{ key: string; message: IMessage }>
    ) {
      const { key, message } = action.payload;
      if (!state[key]) {
        state[key] = [];
      }
      state[key].push(message);
    },
    deleteAllMessages(state) {
      //on logout
      Object.keys(state).forEach((key) => {
        delete state[key];
      });
    },
    deleteMessage(
      //deletes 1 message
      state,
      action: PayloadAction<{ key: string; messageId: string }>
    ) {
      const { key, messageId } = action.payload;
      if (!state[key]) {
        return;
      }
      state[key] = state[key].filter((message) => message.id !== messageId);
    },
  },
});

export const { addMessage, setMessages, deleteMessage, deleteAllMessages } =
  roomMessagesSlice.actions;

export default roomMessagesSlice.reducer;
