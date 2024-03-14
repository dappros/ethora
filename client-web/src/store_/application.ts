import { StateCreator } from "zustand";

interface IFirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId: string
}

export interface IApplicationConfig {
  firebaseWebConfigString?: string
  firebaseConfig?: IFirebaseConfig
  loginBackgroundColor?: string
  primaryColor: string
  secondaryColor: string
  coinSymbol: string
  coinName: string
  appToken: string
  displayName: string
  domainName: string
  logoImage: string
}

export interface ApplicationSliceInterface {
  applicationConfig: IApplicationConfig,
  setApplicationConfig: (applicationConfig: IApplicationConfig) => void
}

const applicationConfigInitState = {
  firebaseWebConfigString: '',
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  },
  loginBackgroundColor: '',
  primaryColor: '',
  secondaryColor: '',
  coinSymbol: '',
  coinName: '',
  appToken: '',
  displayName: '',
  domainName: '',
  logoImage: ''
}

export const createApplicationSlice: StateCreator<
  ApplicationSliceInterface,
  [],
  [],
  ApplicationSliceInterface
> = (set) => ({
  applicationConfig: applicationConfigInitState,
  setApplicationConfig: (applicationConfig: IApplicationConfig) => {
    set((state) => ({...state, applicationConfig }))
  }
})
