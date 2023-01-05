import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, devtools } from "zustand/middleware";
import * as http from "../http";

export type TUser = {
  firstName: string;
  lastName: string;
  description?: string;
  xmppPassword?: string;
  _id: string;
  walletAddress: string;
  token: string;
  refreshToken?: string;
  profileImage?: string;
  referrerId?: string;
  ACL?: {
    ownerAccess: boolean;
    masterAccess: boolean;
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
    receiverMessageId?: number;
    senderFirstName: string;
    senderJID: string;
    senderLastName: string;
    senderWalletAddress: string;
    tokenAmount: number;
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
  coinsInMessage: number;
};

export type TUserBlackList = {
  date: number;
  fullName: string;
  user: string;
};

export type TUserChatRooms = {
  jid: string;
  name: string;
  room_background: string;
  room_thumbnail: string;
  users_cnt: string;
  unreadMessages: number;
  composing: string;
  toUpdate: boolean;
  description: string;
};

export type TUserChatRoomGroups = {
  jid: string;
  group: TActiveRoomFilter;
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

export type TMemberInfo = {
  ban_status: string;
  jid: string;
  last_active: string;
  name: string;
  profile: string;
  role: string;
};

export type TRoomRoles = {
  roomJID: string;
  role: string;
};

export type TActiveRoomFilter = "official" | "meta" | "groups" | 'favourite' |  "";

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
  updateUserProfilePermission: (value: boolean) => void;
  updateUserDocumentsPermission: (value: boolean) => void;
  setDocuments: (documents: http.IDocument[]) => void;

  setOwner: (owner: TUser) => void;
  clearUser: () => void;
  clearOwner: () => void;
  setBalance: (balance: TBalance[]) => void;
  setNewMessage: (msg: TMessage) => void;
  historyMessages: TMessageHistory[];
  setNewMessageHistory: (msg: TMessageHistory) => void;
  updateMessageHistory: (messages: TMessageHistory[]) => void;
  removeAllInMessageHistory: (userJID: string) => void;
  updateCoinsInMessageHistory: (
    id: number,
    userJID: string,
    amount: number
  ) => void;
  clearMessageHistory: () => void;
  sortMessageHistory: () => void;
  userChatRoomGroups: TUserChatRoomGroups[];
  setNewChatRoomGroups: (data: TUserChatRoomGroups) => void;
  updateChatRoomGroups: (data: TUserChatRoomGroups) => void;
  userChatRooms: TUserChatRooms[];
  setNewUserChatRoom: (msg: TUserChatRooms) => void;
  updateUserChatRoom: (data: TUserChatRooms) => void;
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
  blackList: TUserBlackList[];
  saveInBlackList: (msg: TUserBlackList[]) => void;
  clearBlackList: () => void;
  roomMemberInfo: TMemberInfo[];
  setRoomMemberInfo: (data: TMemberInfo[]) => void;
  roomRoles: TRoomRoles[];
  setRoomRoles: (data: TRoomRoles) => void;
  activeRoomFilter: TActiveRoomFilter;
  setActiveRoomFilter: (filter: TActiveRoomFilter) => void;
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
          userChatRoomGroups: [],
          roomMemberInfo: [],
          roomRoles: [],
          appUsers: [],
          documents: [],
          blackList: [],
          activeRoomFilter: "",
          setDocuments: (documents: http.IDocument[]) =>
            set((state) => {
              state.documents = documents;
            }),
          setActiveRoomFilter: (filter: TActiveRoomFilter) =>
            set((state) => {
              state.activeRoomFilter = filter;
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
          updateUserProfilePermission: (value: boolean) =>
            set((state) => {
              state.user.isProfileOpen = value;
            }),
          updateUserDocumentsPermission: (value: boolean) =>
            set((state) => {
              state.user.isAssetsOpen = value;
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
              state.historyMessages = state.historyMessages.filter(
                (v, i, a) => a.findIndex((t) => t.id === v.id) === i
              );
            }),
          updateMessageHistory: (messages: TMessageHistory[]) =>
            set((state) => {
              state.historyMessages = [...state.historyMessages, ...messages];
              state.historyMessages = state.historyMessages.filter(
                (v, i, a) => a.findIndex((t) => t.id === v.id) === i
              );
              state.historyMessages.sort((a: any, b: any) => a.id - b.id);
            }),
          updateCoinsInMessageHistory: (
            id: number,
            userJID: string,
            amount: number
          ) =>
            set((state) => {
              const messageIndex = state.historyMessages.findIndex(
                (t) => t.id === id
              );
              if (messageIndex > -1) {
                state.historyMessages[messageIndex].coinsInMessage += amount;
              }
            }),
          removeAllInMessageHistory: (userJID: string) =>
            set((state) => {
              state.historyMessages = state.historyMessages.filter(
                (item) => item.data.senderJID !== userJID
              );
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
          setNewChatRoomGroups: (userChatRooms: TUserChatRoomGroups) =>
            set((state) => {
              state.userChatRoomGroups.unshift(userChatRooms);
            }),
          updateChatRoomGroups: (data: TUserChatRoomGroups) =>
            set((state) => {
              const currentIndex = state.userChatRoomGroups.findIndex(
                (el) => el.jid === data.jid
              );
              if (state.userChatRoomGroups[currentIndex]) {
                state.userChatRoomGroups[currentIndex].group = data.group;
              }
            }),
          setNewUserChatRoom: (userChatRooms: TUserChatRooms) =>
            set((state) => {
              state.userChatRooms.unshift(userChatRooms);
            }),
          setRoomMemberInfo: (memberInfo: TMemberInfo[]) => {
            set((state) => {
              state.roomMemberInfo = memberInfo;
            });
          },
          setRoomRoles: (data: TRoomRoles) => {
            set((state) => {
              const currentIndex = state.roomRoles.findIndex(
                (el) => el.roomJID === data.roomJID
              );
              if (state.roomRoles[currentIndex]) {
                state.roomRoles[currentIndex].role = data.role;
              } else {
                state.roomRoles.unshift(data);
              }
            });
          },
          updateCounterChatRoom: (roomJID: string) =>
            set((state) => {
              const currentIndex = state.userChatRooms.findIndex(
                (el) => el.jid === roomJID
              );
              if (state.userChatRooms[currentIndex]) {
                state.userChatRooms[currentIndex].unreadMessages++;
              }
            }),
          updateUserChatRoom: (data: TUserChatRooms) =>
            set((state) => {
              const currentIndex = state.userChatRooms.findIndex(
                (el) => el.jid === data.jid
              );
              if (state.userChatRooms[currentIndex]) {
                state.userChatRooms[currentIndex].room_background =
                  data.room_background;
                state.userChatRooms[currentIndex].room_thumbnail =
                  data.room_thumbnail;
                state.userChatRooms[currentIndex].users_cnt = data.users_cnt;
                state.userChatRooms[currentIndex].toUpdate = data.toUpdate;
                state.userChatRooms[currentIndex].description =
                  data.description;
                state.userChatRooms[currentIndex].name = data.name;
              }
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
          saveInBlackList: (list: TUserBlackList[]) =>
            set((state) => {
              state.blackList = list;
            }),
          clearBlackList: () =>
            set((state) => {
              state.blackList = [];
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
