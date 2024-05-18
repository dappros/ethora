import create from "zustand";
import { immer } from 'zustand/middleware/immer'
import { ChatSliceInterface, createChatSlice } from "./chat";

export const useChatStore = create(immer<ChatSliceInterface>(
  (...a) => ({...createChatSlice(...a)})
))


declare global {
  interface Window {
    useChatStore2?: any;
  }
}

window.useChatStore2 = useChatStore
