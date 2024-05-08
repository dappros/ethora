import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/types";

interface ChatState {
  user: User;
  defaultChatRooms: any[];
}

const initialState: ChatState = {
  user: {
    description: "",
    token: "",
    profileImage: "",
    _id: "",
    walletAddress: "",
    xmppPassword: "",

    firstName: "",
    lastName: "",
  },
  defaultChatRooms: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setDefaultChatRooms: (state, action: PayloadAction<any[]>) => {
      state.defaultChatRooms = action.payload;
    },
  },
});

export const { setUser, setDefaultChatRooms } = chatSlice.actions;

export default chatSlice.reducer;
