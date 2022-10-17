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
  firstName: string
  lastName: string
  token: string
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

interface IStore {
  user: TUser
  owner: TOwner
  messages: TMessage[],
  viewMode: TMode,
  balance: TBalance[],
  toggleMode: () => void,
  setUser: (user: TUser) => void,
  setOwner: (owner: TOwner) => void,
  clearUser: () => void,
  clearOwner: () => void,
  setBalance: (balance: TBalance[]) => void,
  setNewMessage: (msg: TMessage) => void
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
      token: ''
    },
    balance: [],
    viewMode: 'light',
    messages: [],
    toggleMode: () => set((state) => {state.viewMode = state.viewMode === 'light' ? 'dark' : 'light'}),
    setUser: (user: TUser) => set((state) => {state.user = user}),
    setOwner: (user: TOwner) => set((state) => {state.owner = user}),
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
      }
    }),
    setBalance: (balance: TBalance[]) => set((state) => {state.balance = balance}),
    setNewMessage: (message: TMessage) => set((state) => {
      console.log('setNewMessage')
      state.messages.unshift(message)
    }),
  }
}))))

declare global {
  interface Window { useState: any; }
}

window.useState = _useStore

export const useStoreState = _useStore
