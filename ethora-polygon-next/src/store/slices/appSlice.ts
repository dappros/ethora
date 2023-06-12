import { StateCreator } from "zustand";

export interface App {
  error: string
}

export interface AppSlice {
  app: App;
  setError: (msg: string) => void;
  removeError: () => void;
}

export const createAppSlice: StateCreator<AppSlice> = (set) => ({
  app: {
    error: ''
  },
  setError: (msg: string) => {
    set({app: {error: msg}})
  },
  removeError: () => {
    set({app: {error: ''}})
  }
})