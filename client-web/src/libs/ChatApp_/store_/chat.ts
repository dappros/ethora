import { StateCreator } from "zustand";
import { wsClient } from "../wsClient_";
import { ModelChat } from "../models";


export type UserType = {
  firstName: string;
  lastName: string;
  profileImage?: string;
  walletAddress?: string;
}

export interface ChatSliceInterface {
  user: UserType;
  chatId: string | null;
  chatList: Array<ModelChat>;
  inited: boolean;
  doOpenChat: (chatId: string) => void;
}

const initUserState = {
  firstName: '',
  lastName: '',
  profileImage: '',
  walletAddress: '',
}

export const createChatSlice: StateCreator<
  ChatSliceInterface,
  [],
  [],
  ChatSliceInterface
> = (set, get) => ({
  user: initUserState,
  chatId: null,
  chatList: [],
  inited: false,
  doOpenChat() {

  }
});
