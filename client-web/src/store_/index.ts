import create from "zustand";
import { ChatSliceInterface, createChatSlice } from "./chat";

export const useChatStore = create<ChatSliceInterface>()((...a) => ({
  ...createChatSlice(...a)
}))

declare global {
  interface Window {
  useChatStore?: any;
  }
}

window.useChatStore = useChatStore
