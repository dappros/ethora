import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, devtools } from "zustand/middleware";
import * as http from "../http";
import { stat } from "fs";
import type { Stripe } from "stripe";
import { IDefaultChatRoom, THomeScreen } from "../http";

// type used for User profile details
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
  isAllowedNewAppCreate: boolean;
  appId?: string;
  isAgreeWithTerms: boolean;
  stripeCustomerId?: string;
  subscriptions?: { data: Stripe.Subscription[] };
  paymentMethods?: { data: Stripe.PaymentMethod[] };
  company?: http.ICompany[];
  homeScreen: THomeScreen;
};

// supposed to be used for switching light / dark themes
type TMode = "light" | "dark";

// this type implements a balance item. Each User may own multiple types of assets, fungible and non-fungible. Balances and history of transactions can be accessed from User profiles.
export type TBalance = {
  balance: number;
  contractAddress: string;
  contractTokenIds?: Array<string>;
  createdAt: string;
  imagePreview: string;
  nftFileUrl?: string;
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

// chat messages
type TMessage = {
  body: string;
  firsName: string;
  lastName: string;
  wallet: string;
  from: string;
  room: string;
  numberOfReplies?: TMessageHistory;
};

export interface IMainMessage {
  text?: string;
  id: number;
  userName: string;
  createdAt?: string | number | Date;
  fileName?: string;
  imageLocation?: string;
  imagePreview?: string;
  mimeType?: string;
  originalName?: string;
  size?: string;
  duration?: string;
  waveForm?: string;
  attachmentId?: string;
  wrappable?: string | boolean;
  nftId?: string;
  nftActionType?: string;
  contractAddress?: string;
  roomJid?: string;
}

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
    isReply?: boolean;
    mainMessage?: IMainMessage;
    showInChannel: boolean;
    isEdited?: boolean;
  };
  roomJID: string;
  date: string;
  key: number;
  coinsInMessage: number;
  numberOfReplies?:TMessageHistory[];
};

export type TUserBlackList = {
  date: number;
  fullName: string;
  user: string;
};

// rooms where our User is a participant (obtained from getRooms and via XMPP) 
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
  group?: TActiveRoomFilter;
};

// this is for Stats feature (App owners / admin users)
export type AppStats = {
  recentlyApiCalls: number;
  recentlyFiles: number;
  recentlyIssuance: number;
  recentlyRegistered: number;
  recentlySessions: number;
  recentlyTransactions: number;
  totalApiCalls: number;
  totalFiles: number;
  totalIssuance: number;
  totalRegistered: number;
  totalSessions: number;
  totalTransactions: number;
};

export type TApp = {
  _id: string;
  displayName: string;
  appName: string;
  appToken: string;
  createdAt: string;
  updatedAt: string;
  defaultAccessAssetsOpen: boolean;
  defaultAccessProfileOpen: boolean;
  usersCanFree: boolean;
  appGoogleId?: string;
  appLogo?: string;
  firebaseWebConfigString?: string;
  stats: AppStats;
  bundleId: string;
  coinName: string;
  coinSymbol: string;
  creatorId: string;
  domainName: string;
  isAllowedNewAppCreate: boolean;
  isBaseApp: boolean;
  isUserDataEncrypted: boolean;
  parentAppId?: string;
  primaryColor: string;
  secondaryColor: string;
  logoImage?: string;
  loginScreenBackgroundImage?: string;
  loginBackgroundColor?: string;
  coinImage?: string;
};

// used within Stats when displaying users stats of certain apps
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

// used to show Users (members) who are participants of this chat (in Chat Details screen)
export type TMemberInfo = {
  ban_status: string;
  jid: string;
  last_active: string;
  name: string;
  profile: string;
  role: string;
};

// Users roles for chat details screen
export type TRoomRoles = {
  roomJID: string;
  role: string;
};

// used during Firebase initialization
interface IFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

// used in App Settings (for app owners / admins interface)
export interface IConfig {
  firebaseWebConfigString?: string;
  firebaseConfig?: IFirebaseConfig;
  loginBackgroundColor?: string;
  primaryColor: string;
  secondaryColor: string;
  coinSymbol: string;
  coinName: string;
  appToken: string;
  displayName: string;
  domainName: string;
  logoImage: string;
}

// chats types for tabs
export type TActiveRoomFilter =
  | "official"
  | "meta"
  | "groups"
  | "favourite"
  | "private"
  | "";

// Chat screen - used when editing messages
export type replaceMessageListItemProps = {
  replaceMessageId: number;
  replaceMessageText: string;
};

interface IStore {
  user: TUser;
  config: IConfig;
  oldTokens?: {
    token: string;
    refreshToken: string;
  };
  showHeaderError: boolean;
  setShowHeaderError: (value: boolean) => void;
  defaultChatRooms: IDefaultChatRoom[];
  setDefaultChatRooms: (value: IDefaultChatRoom[]) => void;
  deleteUserChatRoom: (roomJid: string) => void;
  getDefaultChats: () => Promise<void>;
  ACL: http.IUserAcl;
  messages: TMessage[];
  currentThreadViewMessage: TMessageHistory;
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
  setConfig: (config: IConfig) => void;
  clearUser: () => void;
  clearOwner: () => void;
  setBalance: (balance: TBalance[]) => void;
  setNewMessage: (msg: TMessage) => void;
  setNumberOfReplies: (messageId: number) => void;
  replaceMessage: (messageId: number, messageText: string) => void;
  setCurrentThreadViewMessage: (
    currentThreadViewMessage: TMessageHistory
  ) => void;
  historyMessages: TMessageHistory[];
  setNewMessageHistory: (msg: TMessageHistory) => void;
  updateMessageHistory: (messages: TMessageHistory[] | TMessageHistory) => void;
  removeAllInMessageHistory: (userJID: string) => void;
  updateCoinsInMessageHistory: (
    id: number,
    userJID: string,
    amount: number
  ) => void;
  clearMessageHistory: () => void;
  sortMessageHistory: () => void;
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
  deleteMessage: (messageId: number) => void;
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
            isAllowedNewAppCreate: false,
            isAgreeWithTerms: false,
            homeScreen: "",
          },
          defaultChatRooms: [],
          config: {
            firebaseWebConfigString: "",
            primaryColor: "",
            secondaryColor: "",
            coinSymbol: "",
            coinName: "",
            appToken: "",
            displayName: "",
            domainName: "",
            logoImage: "",
          },
          ACL: {
            result: [
              {
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
            ],
          },
          oldTokens: {
            token: "",
            refreshToken: "",
          },
          apps: [],
          balance: [],
          viewMode: "light",
          messages: [],
          showHeaderError: true,
          currentThreadViewMessage: {
            id: 0,
            body: "",
            data: {
              isSystemMessage: "",
              photoURL: "",
              quickReplies: "",
              roomJid: "",
              receiverMessageId: 0,
              senderFirstName: "",
              senderJID: "",
              senderLastName: "",
              senderWalletAddress: "",
              tokenAmount: 0,
              isMediafile: false,
              originalName: "",
              location: "",
              locationPreview: "",
              mimetype: null,
              xmlns: "",
              isReply: false,
              mainMessage: undefined,
              showInChannel: false,
              isEdited: false,
            },
            roomJID: "",
            date: "",
            key: 0,
            coinsInMessage: 0,
            numberOfReplies: [],
          },
          historyMessages: [],
          loaderArchive: false,
          currentUntrackedChatRoom: "",
          userChatRooms: [],
          roomMemberInfo: [],
          roomRoles: [],
          appUsers: [],
          documents: [],
          blackList: [],
          activeRoomFilter: "official",
          setShowHeaderError(value) {
            set((state) => {
              state.showHeaderError = value;
            });
          },
          setConfig(config) {
            set((state) => {
              state.config = config;
            });
          },
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
          setDefaultChatRooms: (rooms) =>
            set((state) => {
              state.defaultChatRooms = rooms;
            }),

          getDefaultChats: async () => {
            try {
              const chats = await http.getDefaultChats();
              set((state) => {
                state.defaultChatRooms = chats.data;
              });
            } catch (error) {
              console.log(error);
            }
          },
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
                isAllowedNewAppCreate: false,
                isAgreeWithTerms: false,
                homeScreen: "",
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
                isAllowedNewAppCreate: false,
                isAgreeWithTerms: false,
                homeScreen: "",
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
          setNumberOfReplies(messageId: number) {
            set((state) => {
              const messageIndex = state.historyMessages.findIndex(
                (item) => item.id === messageId
              );
              if (!messageId || isNaN(messageId) || messageIndex === -1) {
                return;
              }
              const threadMessages = state.historyMessages.filter(
                (item) => item.data.mainMessage?.id === messageId
              );
              state.historyMessages[messageIndex].numberOfReplies =
                threadMessages;
            });
          },
          replaceMessage(messageId: number, messageText: string) {
            set((state) => {
              const messageIndex = state.historyMessages.findIndex(
                (i) => i.id === messageId
              );
              if (messageIndex > -1) {
                state.historyMessages[messageIndex].body = messageText;
                state.historyMessages[messageIndex].data.isEdited = true;
              }
            });
          },
          setNewMessageHistory: (historyMessages: TMessageHistory) =>
            set((state) => {
              state.historyMessages.unshift(historyMessages);
              state.historyMessages = state.historyMessages.filter(
                (v, i, a) => a.findIndex((t) => t.id === v.id) === i
              );
            }),
          setCurrentThreadViewMessage: (
            currentThreadViewMessage: TMessageHistory
          ) =>
            set((state) => {
              state.currentThreadViewMessage = currentThreadViewMessage;
            }),
          updateMessageHistory: (
            messages: TMessageHistory[] | TMessageHistory
          ) =>
            set((state) => {
              if (!Array.isArray(messages)) {
                state.historyMessages.push(messages);
                console.log(messages);
                return;
              }
              state.historyMessages = [...state.historyMessages, ...messages];
              state.historyMessages = state.historyMessages.filter(
                (v, i, a) => a.findIndex((t) => t.id === v.id) === i
              );
              state.historyMessages.sort((a: any, b: any) => a.id - b.id);
            }),
          deleteMessage: (messageId: number) => {
            set((state) => {
              const messageIndex = state.historyMessages.findIndex(
                (i) => i.id === messageId
              );
              if (messageIndex > -1) {
                state.historyMessages.splice(messageIndex, 1);
              }
            });
          },
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
                state.userChatRooms[currentIndex] = {
                  ...state.userChatRooms[currentIndex],
                  ...data,
                };
              }
            }),
          deleteUserChatRoom: (roomJid: string) =>
            set((state) => {
              const newRooms = state.userChatRooms.filter(
                (c) => c.jid !== roomJid
              );
              state.userChatRooms = newRooms;
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
    useStoreState: any;
  }
}

window.useStoreState = _useStore;

export const useStoreState = _useStore;
