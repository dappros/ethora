import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/types";

interface ChatState {
  user: User;
  defaultChatRooms: any[];
}

const initialState: ChatState = {
  user: {
    _id: "65831a646edcd3cee0545757",
    walletAddress: "0x6816810a7Fe04FC9b800f9D11564C0e4aEC25D78",
    xmppPassword: "HDC7qnWI16",

    firstName: "Yuki",
    lastName: "R",
    description: "",
    token: "",
    profileImage: "",
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
