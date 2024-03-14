import { StateCreator } from "zustand";

export interface IUser {
  _id: string
  firstName: string
  lastName: string
  description?: string
  xmppPassword?: string
  walletAddress: string
  token: string
  refreshToken?: string
  profileImage?: string
  referrerId?: string
  isProfileOpen?: boolean
  isAssetsOpen?: boolean
  isAllowedNewAppCreate: boolean
  appId?: string
  isAgreeWithTerms: boolean
}

export interface UserSliceInterface {
  user: IUser,
  setUser: (user: IUser) => void,
  setUserAuthTokens: (token: string, refreshToken: string) => void,
  clearUser: () => void
}

const userInitState = {
  _id: '',
  firstName: '',
  lastName: '',
  description: '',
  xmppPassword: '',
  walletAddress: '',
  token: '',
  refreshToken: '',
  profileImage: '',
  referrerId: '',
  isProfileOpen: false,
  isAssetsOpen: false,
  isAllowedNewAppCreate: false,
  appId: '',
  isAgreeWithTerms: false,
}

export const createUserSlice: StateCreator<
  UserSliceInterface,
  [],
  [],
  UserSliceInterface
> = (set) => ({
  user: userInitState,
  setUser: (user: IUser) => {
    set((state) => ({...state, user}))
  },
  setUserAuthTokens: (token: string, refreshToken: string) => {
    set((state) => ({...state, user: {...state.user, token, refreshToken}}))
  },
  clearUser: () => {
    set((state) => ({...state, user: userInitState}))
  }
})
