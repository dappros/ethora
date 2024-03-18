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
  localJid: string;
  title: string;
  newMessagesCount: number;
}

export interface XmppSliceInterface {
  currentRoom: RoomType;
  messages: AllMessagesType;
  vCards: Record<string, string>;
  rooms: Record<string, RoomType>
  setCurrentRoom: (room: RoomType) => void;
  addHistoryMessages: (messages: MessageType[]) => void;
  appendHistoryMessages: (messages: MessageType[]) => void;
  addNewMessage: (message: MessageType) => void;
  addVcard: (username: string, FN: string) => void;
  addRooms: (rooms: RoomType[]) => void;
}

function jsonClone(obj: Object) {
  return JSON.parse(JSON.stringify(obj))
}

export const createXmppSlice: StateCreator<
  XmppSliceInterface,
  [],
  [],
  XmppSliceInterface
> = (set, get) => ({
  currentRoom: {
    title: '',
    localJid: '',
    newMessagesCount: 0
  },
  messages: {},
  rooms: {},
  vCards: {
    // "13e0ba0c1fc0f2cebe1e896697a1378ce9a5bbbb30e501a7eb9f5df2414e5128": "Forest Gump"
  },
  setCurrentRoom: (room: RoomType) => {
    set((state) => ({ ...state, currentRoom: room }))
  },

  addHistoryMessages: (msgs: MessageType[]) => {
    if (msgs.length) {
      const fromLocalJid = msgs[0].fromLocalJid
      let messages: DateMessasges;
  
      if (get().messages[fromLocalJid]) {
        messages = jsonClone(get().messages[fromLocalJid])
      } else {
        messages = {}
      }
  
      for (const msg of msgs) {
        if (!messages[msg.date]) {
          messages[msg.date] = [msg]
        } else {
          messages[msg.date].push(msg)
        }
      }
  
      set((state) => ({...state, messages: {...state.messages, [fromLocalJid]: messages}}))
      console.log("new messages state ", get().messages[fromLocalJid])
    }
  },

  appendHistoryMessages: (msgs: MessageType[]) => {
    if (msgs.length) {
      const fromLocalJid = msgs[0].fromLocalJid
      let messages: DateMessasges;
  
      if (get().messages[fromLocalJid]) {
        messages = jsonClone(get().messages[fromLocalJid])
      } else {
        messages = {}
      }
  
      for (const msg of msgs) {
        if (!messages[msg.date]) {
          messages[msg.date] = [msg]
        } else {
          messages[msg.date] = [msg, ...messages[msg.date]]
        }
      }
  
      set((state) => ({...state, messages: {...state.messages, [fromLocalJid]: messages}}))
      console.log("new messages state ", get().messages[fromLocalJid])
    }
  },

  addNewMessage: (msg: MessageType) => {
    const fromLocalJid = msg.fromLocalJid

    let messages: DateMessasges;

    if (get().messages[fromLocalJid]) {
      messages = jsonClone(get().messages[fromLocalJid])
    } else {
      messages = {}
    }

    if (!messages[msg.date]) {
      messages[msg.date] = [msg]
    } else {
      messages[msg.date].push(msg)
    }

    set((state) => ({...state, messages: {...state.messages, [fromLocalJid]: messages}}))
    // eeBus.emit('newMessage', msg)
  },

  addVcard: (username: string, FN: string) => {
    set((state) => ({...state, vCards: {...state.vCards, [username]: FN}}))
  },

  addRooms: (rooms: RoomType[]) => {
    const stateRooms = get().rooms
    const copyRooms = jsonClone(stateRooms)

    for (const room of rooms) {
      copyRooms[room.localJid] = room
    }

    console.log("copyRooms ", copyRooms)

    set((state) => ({...state, rooms: copyRooms}))
  }

  // getRoomsJidList: (rooms)
});
