import { StateCreator } from "zustand";

export interface AuthSlice {
  ttl: number;
  sign: string;
  address: string;
  accessToken: string;
  setAuth: (obj: {ttl: number, sign: string, address: string, accessToken: string}) => void;
  clearAuth: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  ttl: 0,
  sign: '',
  address: '',
  accessToken: '',
  setAuth: (obj) => {
    set({...obj})
  },
  clearAuth: () => {
    set({
      ttl: 0,
      sign: '',
      address: '',
      accessToken: ''
    })
  }
})