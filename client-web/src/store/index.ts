import create from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, devtools } from 'zustand/middleware'

type TUser = {
  firstName: string
  lastName: string
  xmppPassword: string
  _id: string
  walletAddress: string
  token: string
  refreshToken: string
}

type TOwner = {
  _id: string
  firstName: string
  lastName: string
  token: string
  walletAddress: string
}

type TMode = 'light' | 'dark'

type TBalance = {
  balance: number,
  tokenName: string,
  tokenType: string,
  contractAddress: string,
  imagePreview?: string,
  total: number
}

type TMessage = {
  body: string
  firsName: string
  lastName: string
  wallet: string
  from: string
  room: string
}

type TMessageHistory = {
  id: number
  body: string
  data: any
  roomJID: string
  date: string
  photo?: string
  key: number
}

type TUserChatRooms = {
  jid: string
  name: string
  room_background: string
  room_thumbnail: string
  users_cnt: string
}

type TApp = {
  _id: string,
  appName: string,
  appToken: string,
  createdAt: string,
  updatedAt: string,
  defaultAccessAssetsOpen: boolean,
  defaultAccessProfileOpen: boolean,
  usersCanFree: string,
  appGoogleId?: string,
  appLogo?: string,
}

interface IStore {
  user: TUser
  owner: TOwner
  messages: TMessage[],
  viewMode: TMode,
  balance: TBalance[],
  apps: TApp[],
  toggleMode: () => void,
  setUser: (user: TUser) => void,
  setOwner: (owner: TOwner) => void,
  clearUser: () => void,
  clearOwner: () => void,
  setBalance: (balance: TBalance[]) => void,
  setNewMessage: (msg: TMessage) => void,
  historyMessages: TMessageHistory[],
  setNewMessageHistory: (msg: TMessageHistory) => void
  clearMessageHistory: () => void,
  sortMessageHistory: () => void,
  userChatRooms: TUserChatRooms[],
  setNewUserChatRoom: (msg: TUserChatRooms) => void
  clearUserChatRooms: () => void,
  setApps: (apps: TApp[]) => void,
  setApp: (app: TApp) => void,
}

const _useStore = create<IStore>()(devtools(persist(immer((set, get) => {
  return {
    user: {
      firstName: '',
      lastName: '',
      xmppPassword: '',
      _id: '',
      walletAddress: '',
      token: '',
      refreshToken: ''
    },
    owner: {
      firstName: '',
      lastName: '',
      token: '',
      _id: '',
      walletAddress: ''
    },
    apps: [],
    balance: [],
    viewMode: 'light',
    messages: [],
    historyMessages: [],
    userChatRooms: [],
    toggleMode: () => set((state) => {state.viewMode = state.viewMode === 'light' ? 'dark' : 'light'}),
    setUser: (user: TUser) => set((state) => {state.user = user}),
    setOwner: (user: TOwner) => set((state) => {state.owner = user}),
    setApps: (apps: TApp[]) => set((state) => {state.apps = apps}),
    setApp: (app: TApp) => set((state) => {state.apps = [...state.apps, app]}),
    clearApps: () => set((state) => {state.apps = []}),
    clearUser: () => set((state) => {
      state.user = {
        firstName: '',
        lastName: '',
        xmppPassword: '',
        _id: '',
        walletAddress: '',
        token: '',
        refreshToken: ''
      }
    }),
    clearOwner: () => set((state) => {
      state.owner = {
        firstName: '',
        lastName: '',
        token: '',
        _id: '',
        walletAddress: ''
      }
    }),
    setBalance: (balance: TBalance[]) => set((state) => {state.balance = balance}),
    setNewMessage: (message: TMessage) => set((state) => {
      console.log('setNewMessage')
      state.messages.unshift(message)
    }),
    setNewMessageHistory: (historyMessages: TMessageHistory) => set((state) => {
      console.log('setNewMessageHistory')
      state.historyMessages.unshift(historyMessages)
    }),
    clearMessageHistory: () => set((state) => {
      state.historyMessages = [];
    }),
    sortMessageHistory: () => set((state) => {
      state.historyMessages.sort((a: any, b: any) => a.id - b.id);
    }),
    setNewUserChatRoom: (userChatRooms: TUserChatRooms) => set((state) => {
      state.userChatRooms.unshift(userChatRooms)
    }),
    clearUserChatRooms: () => set((state) => {
      state.userChatRooms = [];

    }),
  }
}))))

declare global {
  interface Window { useState: any; }
}

window.useState = _useStore

export const useStoreState = _useStore
