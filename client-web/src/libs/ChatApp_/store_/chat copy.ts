import { StateCreator } from "zustand";
import { wsClient } from "../wsClient_";

export type TreadLinkMessage = {
  text: string,
  id: number,
  userName: string,
  createdAt: string,
  size: string,
  duration: string,
  waveForm: string,
  attachmentId: string,
  wrappable: string,
  nftActionType: string,
  contractAddress: string,
  roomJid: string,
  nftId: string
}

export type MessageType = {
  text: string;
  from: string;
  id: string;
  created: string;
  isMe: boolean;
  xmlns: string;
  senderJID: string;
  senderFirstName: string;
  senderLastName: string;
  senderWalletAddress: string;
  isSystemMessage: "true" | "false";
  tokenAmount: string;
  mucname: string;
  roomJid: string;
  isReply: "true" | "false";
  showInChannel: "true" | "false";
  push: "true" | "false";
  mainMessage?: TreadLinkMessage
  isMediafile?: "true" | "false";
  locationPreview?: string;
}

export type RoomType = {
  jid: string;
  title: string;
  usersCnt: string;
  roomBackground: string;
  room_thumbnail: string;
  groupName?: string;
  newMessagesCount: number;
  recentMessage: MessageType | null;
  loading: boolean;
  allLoaded: boolean;
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
  rooms: Record<string, RoomType>;
  messages: Record<string, MessageType[]>;
  threadsMessages: Record<string, MessageType[]>;
  currentThreadMessage: MessageType | null;
  isInitCompleted: boolean;
  xmppStatus: string;
  editMessage: MessageType | null;
  setCurrentRoom: (room: RoomType) => void;
  setRooms: (rooms: Record<string, RoomType>) => void;
  setMessages: (jid: string, messages: MessageType[]) => void;
  csSetUser: (user: UserType) => void;
  addMessages: (jid: string, messages: MessageType[]) => void;
  setIsInitCompleted: (val: boolean) => void;
  setXmppStatus: (val: string) => void;
  setLoading: (jid: string, isLoading: boolean) => void;
  loadMoreMessages: (jid: string) => void;
  setCurrentRoomLoading: (isLoading: boolean) => void;
  setThreadMessages: (messages: MessageType[]) => void;
  getThreadMessages: (id: number) => MessageType[] | null;
  setCurrentThreadMessage: (message: MessageType | null) => void;
  addNewMessage: (jid: string, message: MessageType) => void;
  setNewThreadMessage: (message: MessageType) => void;
  leaveCurrentRoom: () => void;
  deleteMessage: (roomJid: string, messageId: string) => void;
  setEditMessage: (message: MessageType | null) => void;
  doEditMessage: (roomJid: string, text: string, messageId: string) => void;
  addNewRoom: (room: RoomType) => void;
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
  loading: false,
  allLoaded: false,
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
  rooms: {},
  messages: {},
  threadsMessages: {},
  currentThreadMessage: null,
  isInitCompleted: false,
  xmppStatus: '',
  editMessage: null,

  setThreadMessages: (messages) => {
    for (const message of messages) {
      const id = message.mainMessage?.id
      if (id) {
        const prevMessages = get().threadsMessages[message.mainMessage?.id] || []
        set(state => ({...state, threadsMessages: {...state.threadsMessages, [id]: [...prevMessages, message]}}))
      }
    }
  },

  getThreadMessages: (id: number) => {
    return get().threadsMessages[id] || null
  },

  setNewThreadMessage: (message) => {
    console.log('setNewThreadMessage')
    const id = message.mainMessage?.id
    if (id) {
      const prevMessages = get().threadsMessages[message.mainMessage?.id] || []
      set(state => ({...state, threadsMessages: {...state.threadsMessages, [id]: [...prevMessages, message]}}))
    }
  },

  setCurrentThreadMessage: (message: MessageType | null) => set((state) => ({...state, currentThreadMessage: message})),

  setIsInitCompleted: (val) => set((state) => ({...state, isInitCompleted: val})),

  setCurrentRoom: (room: RoomType) => {
    set((state) => ({ ...state, currentRoom: room }))
  },

  setRooms(rooms: Record<string, RoomType>) {
    set((state) => ({...state, rooms: rooms}))
  },

  addNewRoom(room: RoomType) {
    set((state) => ({...state, rooms: {...state.rooms, [room.jid]: room}, currentRoom: {...room}}))
  },

  setLoading(jid, isLoading) {
    set((state) => {
      if (state.currentRoom.jid === jid) {
        return {
          ...state,
          rooms: {...state.rooms, [jid]: {...state.rooms[jid], loading: isLoading}},
          currentRoom: {...state.currentRoom, loading: isLoading}
        }
      } else {
        return {
          ...state,
          rooms: {...state.rooms, [jid]: {...state.rooms[jid], loading: isLoading}},
        }
      }

    })
  },

  setMessages(jid, messages) {
    set((state) => ({...state, messages: {...state.messages, [jid]: messages}}))
  },

  addMessages(jid, messages) {
    const storeMessages = get().messages[jid]
    messages = messages.filter((el) => {
      return storeMessages.findIndex(msg => msg.id === el.id) === -1
    })
    set((state) => ({...state, messages: {...state.messages, [jid]: [...messages, ...state.messages[jid]]}}))
  },

  deleteMessage(roomJid, messageId) {
    const messages = get().messages
    const roomMessages = messages[roomJid]

    if (roomMessages) {
      const newMessages = roomMessages.filter((msg) => msg.id !== messageId)

      set(state => ({...state, messages: {...messages, [roomJid]: newMessages}}))
    }
  },

  addNewMessage(jid, message) {
    const storeMessages = get().messages[jid]

    if (!storeMessages) {
      set((state) => ({...state, messages: {...state.messages, [jid]: [message]}}))
    } else {
      if (storeMessages.findIndex(msg => msg.id === message.id) === -1) {
        set((state) => ({...state, messages: {...state.messages, [jid]: [...state.messages[jid], message]}}))
      }
    }
  },

  csSetUser(user) {
    set((state) => ({...state, user: jsonClone(user) }))
  },

  setXmppStatus(status) {
    set((state) => ({...state, xmppStatus: status}))
  },

  setCurrentRoomLoading(isLoading: boolean) {
    set(state => {
      const currentRoom = state.currentRoom

      return {
        ...state,
        currentRoom: {
          ...currentRoom,
          loading: isLoading
        }
      }
    })
  },

  async loadMoreMessages(jid: string) {
    const {loading, allLoaded} = get().currentRoom
    if (loading || allLoaded) {
      return
    }

    get().setCurrentRoomLoading(true)
    const roomMessages = get().messages[jid]

    wsClient.getHistory(jid, 30, Number(roomMessages[0].id))
      .then((resp) => {
        let replies = []
        resp = resp.filter((el) => {
          if (el.mainMessage) {
            replies.push(el)
          }

          if (el.mainMessage && el.showInChannel === "false") {
            return false
          }

          return true;
        })
        get().setThreadMessages(replies)
        get().addMessages(jid, resp)
        get().setCurrentRoomLoading(false)
      })
  },

  leaveCurrentRoom() {
    let currentRoom = get().currentRoom
    const rooms = get().rooms
    const keys = Object.keys(rooms)
    const len = keys.length

    const index = keys.findIndex(el => el === currentRoom.jid)
    
    if (len === 1) {

    } else {
      let nextIndex = (len - 1) !== index ? index + 1 : index - 1

      const nextCurrentRoomJid = keys[nextIndex]

      const newRooms = {...rooms}
      delete newRooms[currentRoom.jid]

      currentRoom = rooms[nextCurrentRoomJid]

      set((state) => ({...state, currentRoom: {...currentRoom}, rooms: {...newRooms}}))
    }

  },

  setEditMessage(message) {
    set(state => ({...state, editMessage: message}))
  },

  doEditMessage(roomJid, text, messageId) {
    const messages = get().messages[roomJid]

    if (messages) {
      const newMessages = messages.map(el => {
        if (el.id === messageId) {
          return {
            ...el,
            text: text
          }
        } else {
          return el
        }
      })

      set(state => ({...state, messages: {...state.messages, [roomJid]: [...newMessages]}}))
    }
  },
});
