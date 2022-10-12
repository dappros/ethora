import create from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, devtools } from 'zustand/middleware'

type TUser = {
  firstName: string
  lastName: string,
  xmppPassword: string
  _id: string
  walletAddress: string
  token: string
  refreshToken: string
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
}

interface IStore {
  user: TUser
  messages: TMessage[],
  viewMode: TMode,
  balance: TBalance[],
  toggleMode: () => void,
  setUser: (user: TUser) => void,
  clearUser: () => void,
  setBalance: (balance: TBalance[]) => void,
  setNewMessage: (msg: TMessage) => void,
  historyMessages: TMessageHistory[],
  setNewMessageHistory: (msg: TMessageHistory) => void
  clearMessageHistory: () => void,
  sortMessageHistory: () => void,
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
    balance: [],
    viewMode: 'light',
    messages: [],
    historyMessages: [],
    toggleMode: () => set((state) => {state.viewMode = state.viewMode === 'light' ? 'dark' : 'light'}),
    setUser: (user: TUser) => set((state) => {state.user = user}),
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
  }
}))))

declare global {
  interface Window { useState: any; }
}

window.useState = _useStore

export const useStoreState = _useStore
