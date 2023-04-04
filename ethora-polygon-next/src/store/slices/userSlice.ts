import { StateCreator } from "zustand";

export interface User {
  firstName: string,
}

export interface UserSlice {
  user: User  | null;
  address: string;
  setUser: (user: User) => void;
  removeUser: () => void;
  setAddress: (address: string) => void;
}

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  user: {
    firstName: ''
  },
  address: '',
  setUser: (user: User) => {
    set({user})
  },
  removeUser: () => {
    set({user: null})
  },
  setAddress: (address: string) => {
    set({address})
  }
})