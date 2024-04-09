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

export interface ChatSliceInterface {
  currentRoom: RoomType;
  rooms: RoomType[];
  messages: Record<string, Record<string, string>[]>;
  setCurrentRoom: (room: RoomType) => void;
  setRooms: (rooms: RoomType[]) => void;
  setMessages: (jid: string, messages: Record<string, string>[]) => void;
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

export const createChatSlice: StateCreator<
  ChatSliceInterface,
  [],
  [],
  ChatSliceInterface
> = (set, get) => ({
  currentRoom: currentRoomInitState,
  rooms: [],
  messages: {},

  setCurrentRoom: (room: RoomType) => {
    set((state) => ({ ...state, currentRoom: room }))
  },

  setRooms(rooms: RoomType[]) {
    set((state) => ({...state, rooms: rooms}))
  },

  setMessages(jid, messages) {
    set((state) => ({...state, messages: {...state.messages, [jid]: messages}}))
  }
});
