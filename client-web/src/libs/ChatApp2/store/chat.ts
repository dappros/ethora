import { StateCreator } from "zustand";
import { ModelState, ModelMeUser } from "../models";

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
  doChatMarkedAsRead: () => {}
});
