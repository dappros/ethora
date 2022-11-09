import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, devtools } from "zustand/middleware";
import * as http from "../http";

type TUser = {
  firstName: string;
  lastName: string;
  description?: string;
  xmppPassword?: string;
  _id: string;
  walletAddress: string;
  token: string;
  refreshToken?: string;
  profileImage?: string;
  ACL?: {
    ownerAccess: boolean;
  };
  isProfileOpen?: boolean;
  isAssetsOpen?: boolean;
  appId?: string;
};

type TMode = "light" | "dark";

export type TBalance = {
  balance: number;
  contractAddress: string;
  contractTokenIds?: Array<string>;
  createdAt: string;
  imagePreview: string;
  nftFileUrl: string;
  nftId: string;
  nftMetaUrl: string;
  nftMimetype: string;
  nftOriginalname: string;
  tokenName: string;
  tokenType: string;
  total: string;
  updatedAt: string;

  maxSupplies?: [100, 25, 5];

  traits?: Array<string>;
};

type TMessage = {
  body: string;
  firsName: string;
  lastName: string;
  wallet: string;
  from: string;
  room: string;
};

export type TMessageHistory = {
  id: number;
  body: string;
  data: {
    isSystemMessage: string;
    photoURL: string;
    quickReplies: string;
    roomJid: string;
    senderFirstName: string;
    senderJID: string;
    senderLastName: string;
    senderWalletAddress: string;
    tokenAmount: string;
    isMediafile?: boolean;
    originalName?: string;
    location?: string;
    locationPreview?: string;
    mimetype?: string;
    xmlns: string;
  };
  roomJID: string;
  date: string;
  key: number;
};

export type TUserChatRooms = {
  jid: string;
  name: string;
  room_background: string;
  room_thumbnail: string;
  users_cnt: string;
  unreadMessages: number;
  composing: string;
};

type TApp = {
  _id: string;
  appName: string;
  appToken: string;
  createdAt: string;
  updatedAt: string;
  defaultAccessAssetsOpen: boolean;
  defaultAccessProfileOpen: boolean;
  usersCanFree: string;
  appGoogleId?: string;
  appLogo?: string;
};

type TAppUser = {
  appId: string;
  firstName: string;
  lastName: string;
  username?: string;
  email?: string;
  defaultWallet: {
    walletAddress: string;
  };
  isAssetsOpen: boolean;
  isProfileOpen: boolean;
  createdAt: string;
  updatedAt: string;
};

interface IStore {
  user: TUser;
  oldTokens?: {
    token: string;
    refreshToken: string;
  };
  ACL: http.IUserAcl;
  messages: TMessage[];
  viewMode: TMode;
  balance: TBalance[];
  apps: TApp[];
  appUsers: TAppUser[];
  documents: http.IDocument[];
  toggleMode: () => void;
  setUser: (user: TUser) => void;
  setDocuments: (documents: http.IDocument[]) => void;

  setOwner: (owner: TUser) => void;
  clearUser: () => void;
  clearOwner: () => void;
  setBalance: (balance: TBalance[]) => void;
  setNewMessage: (msg: TMessage) => void;
  historyMessages: TMessageHistory[];
  setNewMessageHistory: (msg: TMessageHistory) => void;
  updateMessageHistory: (messages: TMessageHistory[]) => void;
  clearMessageHistory: () => void;
  sortMessageHistory: () => void;
  userChatRooms: TUserChatRooms[];
  setNewUserChatRoom: (msg: TUserChatRooms) => void;
  updateCounterChatRoom: (roomJID: string) => void;
  clearCounterChatRoom: (roomJID: string) => void;
  updateComposingChatRoom: (
    roomJID: string,
    status: boolean,
    userName?: string
  ) => void;
  clearUserChatRooms: () => void;
  setApps: (apps: TApp[]) => void;
  setApp: (app: TApp) => void;
  updateApp: (app: TApp) => void;
  deleteApp: (id: string) => void;
  loaderArchive: boolean;
  setLoaderArchive: (status: boolean) => void;
  addAppUsers: (users: TAppUser[]) => void;
  setACL: (acl: http.IUserAcl) => void;
  currentUntrackedChatRoom: string;
  setCurrentUntrackedChatRoom: (roomJID: string) => void;
}

const _useStore = create<IStore>()(
  devtools(
    persist(
      immer((set, get) => {
        return {
          user: {
            firstName: "",
            lastName: "",
            xmppPassword: "",
            description: "",
            _id: "",
            walletAddress: "",
            token: "",
            refreshToken: "",
            profileImage: "",
          },
          ACL: {
            result: {
              application: {
                appCreate: {},
                appPush: {},
                appSettings: {},
                app: {},
                appStats: {},
                appTokens: {},
                appUsers: {},
              },
              network: { netStats: {} },
              createdAt: "",
              updatedAt: "",
              userId: "",
              _id: "",
              appId: "",
            },
          },
          oldTokens: {
            token: "",
            refreshToken: "",
          },
          apps: [],
          balance: [],
          viewMode: "light",
          messages: [],
          historyMessages: [],
          loaderArchive: false,
          currentUntrackedChatRoom: "",
          userChatRooms: [],
          appUsers: [],
          documents: [],
          setDocuments: (documents: http.IDocument[]) =>
            set((state) => {
              state.documents = documents;
            }),
          setACL: (acl: http.IUserAcl) =>
            set((state) => {
              state.ACL = acl;
            }),
          toggleMode: () =>
            set((state) => {
              state.viewMode = state.viewMode === "light" ? "dark" : "light";
            }),
          setUser: (user: TUser) =>
            set((state) => {
              state.user = user;
            }),
          setOwner: (user: TUser) =>
            set((state) => {
              state.user = user;
            }),
          setApps: (apps: TApp[]) =>
            set((state) => {
              state.apps = apps;
            }),
          setApp: (app: TApp) =>
            set((state) => {
              state.apps = [...state.apps, app];
            }),
          updateApp: (app: TApp) =>
            set((state) => {
              const index = state.apps.findIndex((el) => el._id === app._id);
              state.apps.splice(index, 1, app);
              state.apps = [...state.apps];
            }),
          deleteApp: (id: string) =>
            set((state) => {
              const apps = state.apps.filter((app) => app._id !== id);
              state.apps = [...apps];
            }),
          clearApps: () =>
            set((state) => {
              state.apps = [];
            }),
          clearUser: () =>
            set((state) => {
              state.user = {
                firstName: "",
                lastName: "",
                xmppPassword: "",
                _id: "",
                walletAddress: "",
                token: "",
                refreshToken: "",
                profileImage: "",
              };
            }),
          clearOwner: () =>
            set((state) => {
              state.user = {
                firstName: "",
                lastName: "",
                xmppPassword: "",
                _id: "",
                walletAddress: "",
                token: "",
                refreshToken: "",
                profileImage: "",
              };
              state.apps = [];
              state.appUsers = [];
            }),
          setBalance: (balance: TBalance[]) =>
            set((state) => {
              state.balance = balance;
            }),
          setNewMessage: (message: TMessage) =>
            set((state) => {
              state.messages.unshift(message);
            }),
          setNewMessageHistory: (historyMessages: TMessageHistory) =>
            set((state) => {
              state.historyMessages.unshift(historyMessages);
            }),
          updateMessageHistory: (messages: TMessageHistory[]) =>
            set((state) => {
              state.historyMessages = [...state.historyMessages, ...messages];
              state.historyMessages.sort((a: any, b: any) => a.id - b.id);
            }),
          setLoaderArchive: (status: boolean) =>
            set((state) => {
              state.loaderArchive = status;
            }),
          clearMessageHistory: () =>
            set((state) => {
              state.historyMessages = [];
            }),
          sortMessageHistory: () =>
            set((state) => {
              state.historyMessages.sort((a: any, b: any) => a.id - b.id);
            }),
          setNewUserChatRoom: (userChatRooms: TUserChatRooms) =>
            set((state) => {
              state.userChatRooms.unshift(userChatRooms);
            }),
          updateCounterChatRoom: (roomJID: string) =>
            set((state) => {
              const currentIndex = state.userChatRooms.findIndex(
                (el) => el.jid === roomJID
              );
              state.userChatRooms[currentIndex].unreadMessages++;
            }),
          clearCounterChatRoom: (roomJID: string) =>
            set((state) => {
              const currentIndex = state.userChatRooms.findIndex(
                (el) => el.jid === roomJID
              );
              if (currentIndex !== -1) {
                state.userChatRooms[currentIndex].unreadMessages = 0;
              }
            }),
          clearUserChatRooms: () =>
            set((state) => {
              state.userChatRooms = [];
            }),
          updateComposingChatRoom: (
            roomJID: string,
            status: boolean,
            userName: string
          ) =>
            set((state) => {
              const currentIndex = state.userChatRooms.findIndex(
                (el) => el.jid === roomJID
              );
              if (state.userChatRooms[currentIndex]) {
                if (status) {
                  state.userChatRooms[currentIndex].composing =
                    userName + " is typing";
                } else {
                  state.userChatRooms[currentIndex].composing = "";
                }
              }
            }),
          addAppUsers: (users: TAppUser[]) =>
            set((state) => {
              state.appUsers = [...state.appUsers, ...users];
            }),
          setCurrentUntrackedChatRoom: (roomJID: string) =>
            set((state) => {
              state.currentUntrackedChatRoom = roomJID;
            }),
        };
      })
    )
  )
);

declare global {
  interface Window {
    useState: any;
  }
}

window.useState = _useStore;

export const useStoreState = _useStore;
