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
    _id: "65495bdae5b326bb1b2d33e7",
    walletAddress: "0x6C394B10F5Da4141b99DB2Ad424C5688c3f202B3",
    xmppPassword: "Q9MIMMhZVe",

    firstName: "Roman",
    lastName: "Leshchukh",
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
