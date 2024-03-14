import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../types/types";

interface LoginState {
  isAuthenticated: boolean;
  user: IUser;
}

const initialState: LoginState = {
  isAuthenticated: false,
  user: {
    id: null,
    name: null,
  },
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ id: string; name: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = {
        id: null,
        name: null,
      };
    },
    getInfo: (state, action: PayloadAction<{ id: string }>) => {
      if (state.isAuthenticated) {
        state.user.id = action.payload.id;
      }
    },
  },
});

export const { login, logout, getInfo } = loginSlice.actions;

export default loginSlice.reducer;
