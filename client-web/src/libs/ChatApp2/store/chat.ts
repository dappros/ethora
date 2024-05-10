import { StateCreator } from "zustand";
import { ModelState, ModelMeUser, ModelChatMessage } from "../models";
import getChat from "../utils/getChat";
import { setChat } from "../utils/setChat";

type ImmerStateCreator<T> = StateCreator<
  T,
  [["zustand/immer", never], never],
  [],
  T
>;

export interface ChatSliceInterface extends ModelState {
  doBootstraped: (user: ModelMeUser) => void;
  doConnect: () => void;
  doDisconnected: () => void;
  doConnected: () => void;
  doShow: () => void;
  doChatMarkedAsRead: (chatId: string) => void;
  doReceivedNewMessage: (message: ModelChatMessage) => void;
}

export const createChatSlice: ImmerStateCreator<
  ChatSliceInterface
> = (set, get) => ({
  inited: false,
  connection: 'disconnected',
  resyncing: null,
  visible: false,
  focused: false,
  chatId: null,
  chatList: [],
  me: null,
  doBootstraped: (user: ModelMeUser) => set((state) => {state.me = user}),
  doConnect: () => set(state => {state.connection = 'connecting'}),
  doDisconnected: () => set(s => {s.connection = 'disconnected'}),
  doConnected: () => set(s => {s.connection = 'connected'}),
  doShow: () => set((state) => {state.visible = true}),
  doChatMarkedAsRead: () => {},
  doReceivedNewMessage: (message: ModelChatMessage) => {
    const state = get()
    const chatId = message.from.chatId
    const oldChat = getChat(state.chatList, chatId)

    if (oldChat) {
      let hasUnread;

      const isMyMessage = (message.from.nickname === state.me.xmppUsername)
      if (isMyMessage) {
        hasUnread = oldChat.hasUnread
      } else {
        hasUnread = !(chatId === state.chatId)
      }

      const newChat = {
        ...oldChat,
        hasUnread: hasUnread,
        messages: oldChat.messages.concat([message])
      }

      state.chatList = setChat(state.chatList, newChat)
    }
  }
});
