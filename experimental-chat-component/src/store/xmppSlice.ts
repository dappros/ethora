import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { XmppState } from "../types/types";
import xmppClient from "../networking/xmppClient";

const initialState: XmppState = {
  client: null,
  loading: false,
};

export const xmppSlice = createSlice({
  name: "xmpp",
  initialState,
  reducers: {
    initClient: (
      state,
      action: PayloadAction<{ login: string; password: string }>
    ) => {
      state.loading = true;
      state.client = xmppClient;
      state.client.init(action.payload.login, action.payload.password);
      state.loading = false;
    },
  },
});

export const { initClient } = xmppSlice.actions;

export default xmppSlice.reducer;
