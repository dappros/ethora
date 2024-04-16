import { StateCreator } from "zustand";

export type MessageType = {
  text: string;
  FN: string;
  username: string;
  fromLocalJid: string;
  timestamp: number;
  id: number;
  date: string;
}

type jid = string;
type date = string;

export type DateMessasges = Record<date, MessageType[]>
export type AllMessagesType = Record<jid, DateMessasges>

export type RoomType = {
  jid: string;
  title: string;
  usersCnt: string;
  roomBackground: string;
  room_thumbnail: string;
  groupName?: string;
  newMessagesCount: number;
  recentMessage: Record<string, string> | null
}

export type UserType = {
  firstName: string;
  lastName: string;
  profileImage?: string;
  walletAddress?: string;
}

export interface ChatSliceInterface {
  user: UserType;
  currentRoom: RoomType;
  rooms: RoomType[];
  messages: Record<string, Record<string, string>[]>;
  isInitCompleted: boolean;
  xmppStatus: string;
  setCurrentRoom: (room: RoomType) => void;
  setRooms: (rooms: RoomType[]) => void;
  setMessages: (jid: string, messages: Record<string, string>[]) => void;
  csSetUser: (user: UserType) => void;
  addMessages: (jid: string, messages: Record<string, string>[]) => void;
  setIsInitCompleted: (val: boolean) => void;
  setXmppStatus: (val: string) => void;
}

function jsonClone(obj: Object) {
  return JSON.parse(JSON.stringify(obj))
}

const currentRoomInitState = {
  jid: '',
  title: '',
  usersCnt: '',
  roomBackground: '',
  room_thumbnail: '',
  groupName: '',
  newMessagesCount: 0,
  recentMessage: null,
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
  currentRoom: currentRoomInitState,
  rooms: [],
  messages: {},
  isInitCompleted: false,
  xmppStatus: '',

  setIsInitCompleted: (val) => set((state) => ({...state, isInitCompleted: val})),

  setCurrentRoom: (room: RoomType) => {
    set((state) => ({ ...state, currentRoom: room }))
  },

  setRooms(rooms: RoomType[]) {
    set((state) => ({...state, rooms: rooms}))
  },

  setMessages(jid, messages) {
    set((state) => ({...state, messages: {...state.messages, [jid]: messages}}))
  },

  addMessages(jid, messages) {
    set((state) => ({...state, messages: {...state.messages, [jid]: [...state.messages[jid], ...messages]}}))
  },

  csSetUser(user) {
    set((state) => ({...state, user: jsonClone(user) }))
  },

  setXmppStatus(status) {
    set((state) => ({...state, xmppStatus: status}))
  }
});
