//@ts-ignore
import { client, xml } from "@xmpp/client"
import { makeAutoObservable, runInAction, toJS } from "mobx"
import {
  defaultChatBackgroundTheme,
  defaultChats,
  IMetaRoom,
  metaRooms,
} from "../../docs/config"
import {
  addChatRoom,
  getChatRoom,
  getRoomList,
} from "../components/realmModels/chatList"
import {
  getAllMessages,
  insertMessages,
  updateMessageToWrapped,
  updateNumberOfReplies,
  updateTokenAmount,
  updateMessageText,
  deleteMessageObject,
} from "../components/realmModels/messages"
import { showToast } from "../components/Toast/toast"
import { httpPost } from "../config/apiService"
import { asyncStorageConstants } from "../constants/asyncStorageConstants"
import { asyncStorageGetItem } from "../helpers/cache/asyncStorageGetItem"
import { asyncStorageSetItem } from "../helpers/cache/asyncStorageSetItem"
import {
  createMessageObject,
  IMainMessage,
} from "../helpers/chat/createMessageObject"
import { playCoinSound } from "../helpers/chat/playCoinSound"
import {
  reverseUnderScoreManipulation,
  underscoreManipulation,
} from "../helpers/underscoreLogic"
import {
  getBlackList,
  getRoomInfo,
  getUserRoomsStanza,
  presenceStanza,
  retrieveOtherUserVcard,
  subscribeStanza,
  subscribeToRoom,
  updateVCard,
  vcardRetrievalRequest,
} from "../xmpp/stanzas"
import { XMPP_TYPES } from "../xmpp/xmppConstants"
import { RootStore } from "./context"
import { Results } from "realm"
import { checkIsDefaultChat } from "../helpers/chat/checkIsDefaultChat"
import { TCombinedMimeType } from "../constants/mimeTypes"
const ROOM_KEYS = {
  official: "official",
  private: "private",
  groups: "groups",
}

//interfaces and types
interface recentRealtimeChatProps {
  avatar?: string
  createdAt: any
  message_id: string
  name?: string
  room_name: string
  text: string
  user_id?: string
  system: boolean
  shouldUpdateChatScreen: boolean
  mimetype?: string
  tokenAmount?: string
  image?: string
  realImageURL?: string
  isStoredFile?: boolean
  size?: string
  duration?: any
  waveForm?: any
}

export interface roomListProps {
  name: string
  participants: number
  avatar: string
  jid: string
  counter: number
  lastUserText: string
  lastUserName: string
  createdAt: string
  priority?: number
  muted?: boolean
  isFavourite?: boolean
  roomThumbnail?: string
  roomBackground?: string
  roomBackgroundIndex?: number
}

interface isComposingProps {
  state: boolean
  username: string
  manipulatedWalletAddress: string
  chatJID: string
}

export interface roomMemberInfoProps {
  ban_status: string
  jid: string
  last_active: string
  name: string
  profile: string
  role: string
}

export interface BlackListUser {
  userJid: string
  date: number
  name: string
}

export interface replaceMessageListItemProps {
  replaceMessageId: string
  replaceMessageText: string
}

export interface IMessage {
  imageLocationPreview?: any
  imageLocation?: any
  _id: string
  text?: string
  createdAt: string | number | Date
  system: boolean
  tokenAmount?: number
  user: {
    _id: string
    name: string
    avatar: string
  }
  image?: string
  realImageURL?: string
  localURL?: string
  isStoredFile?: boolean
  mimetype?: TCombinedMimeType
  duration?: string
  size?: string
  waveForm?: string
  roomJid: string
  receiverMessageId: string
  quickReplies: string
  attachmentId?: string
  wrappable: boolean
  nftId?: string
  nftName?: string
  nftActionType?: string
  contractAddress?: string
  fileName?: string
  originalName?: string
  isReply?: boolean
  mainMessage?: IMainMessage
  numberOfReplies?: number
  showInChannel?: boolean
  preview?: string
  isReplace?: boolean
  replaceMessageId?: string
  isEdited?: boolean
}

export interface User {
  _id: string
  avatar: string
  name: string
}

export interface IbackgroundTheme {
  value: string
  isSelected: boolean
  alt: string
}
//interfaces and types

let temporaryArchiveMessages: IMessage[]
export class ChatStore {
  messages: IMessage[] = []
  xmpp: any = null
  xmppError: any = ""
  roomList: roomListProps[] | [] = []
  stores: RootStore
  roomsInfoMap: any = { isUpdated: 0 }
  chatLinkInfo: any = {}
  blackList: BlackListUser[] = []
  allMessagesArrived = false
  replaceMessageList: replaceMessageListItemProps[] = []
  metaRooms: IMetaRoom[] = []
  recentRealtimeChat: recentRealtimeChatProps = {
    createdAt: undefined,
    message_id: "",
    room_name: "",
    text: "",
    system: false,
    shouldUpdateChatScreen: false,
  }
  shouldCount = true
  roomRoles: any = []
  isOnline = false
  showMetaNavigation = false

  isLoadingEarlierMessages = false
  activeChats = ROOM_KEYS.official
  isComposing: isComposingProps = {
    state: false,
    username: "",
    manipulatedWalletAddress: "",
    chatJID: "",
  }
  listOfThreads = []
  roomMemberInfo: roomMemberInfoProps[] = []
  unreadMessagesForGroups = {
    [ROOM_KEYS.official]: 0,
    [ROOM_KEYS.private]: 0,
    [ROOM_KEYS.groups]: 0,
  }
  backgroundTheme: IbackgroundTheme[] = defaultChatBackgroundTheme
  selectedBackgroundIndex = 0
  userBanData = {
    success: false,
    senderName: "",
    name: "",
  }

  constructor(stores: RootStore) {
    makeAutoObservable(this)
    this.stores = stores
  }

  setInitialState = () => {
    runInAction(() => {
      this.messages = []
      this.xmpp = null
      this.xmppError = ""
      this.roomList = []
      this.roomsInfoMap = {}
      this.allMessagesArrived = false
      this.recentRealtimeChat = {
        createdAt: undefined,
        message_id: "",
        room_name: "",
        text: "",
        system: false,
        shouldUpdateChatScreen: false,
      }
      this.shouldCount = true
      this.roomRoles = []
      this.isComposing = {
        state: false,
        username: "",
        manipulatedWalletAddress: "",
        chatJID: "",
      }
      this.listOfThreads = []
      this.backgroundTheme = defaultChatBackgroundTheme
      this.selectedBackgroundIndex = 0
      this.userBanData = {
        success: false,
        senderName: "",
        name: "",
      }
      this.replaceMessageList = []
    })
  }

  //actions
  toggleShouldCount = (value: boolean) => {
    runInAction(() => {
      this.shouldCount = value
    })
  }

  toggleMetaNavigation = (value: boolean) => {
    runInAction(() => {
      this.showMetaNavigation = value
    })
  }

  changeBackgroundTheme = (index: number) => {
    runInAction(() => {
      this.backgroundTheme = defaultChatBackgroundTheme
      if (index != -1) {
        this.backgroundTheme[index].isSelected = true
      }
      this.selectedBackgroundIndex = index
    })
  }

  //insert edited message into list of edited messages
  addToReplaceMessageList = (
    replaceMessageId: any,
    replaceMessageText: string
  ) => {
    const replaceMessageListItem: replaceMessageListItemProps = {
      replaceMessageId: replaceMessageId,
      replaceMessageText: replaceMessageText,
    }
    runInAction(() => {
      this.replaceMessageList.push(replaceMessageListItem)
    })
  }

  //remove an edited message from the list of edited messages
  removeFromReplaceMessageList = (replaceMessageId: string) => {
    const messageIndex = this.replaceMessageList.findIndex(
      (item) => item.replaceMessageId === replaceMessageId
    )
    if (messageIndex)
      runInAction(() => {
        this.replaceMessageList.splice(messageIndex, 1)
      })
  }

  //save user ban related data
  setUserBanData = (senderName: string, name: string) => {
    runInAction(() => {
      this.userBanData.name = name
      this.userBanData.senderName = senderName
    })
  }

  //set if user ban is success or not
  setUserBanSuccess = (value: boolean) => {
    runInAction(() => {
      this.userBanData.success = value
    })
  }

  //clear any data in user ban
  clearUserBanData = () => {
    runInAction(() => {
      this.userBanData.success = false
      this.userBanData.name = ""
      this.userBanData.senderName = ""
    })
  }

  //set roles associated to the provided room in store
  setRoomRoles = (jid: string, role: string) => {
    runInAction(() => {
      this.roomRoles[jid] = role
    })
  }

  //check if user is a moderator or admin
  checkIsModerator = (roomJid: string) => {
    return (
      this.roomRoles[roomJid] === "moderator" ||
      this.roomRoles[roomJid] === "admin"
    )
  }

  //function to start a new xmpp connection
  xmppConnect = (username: string, password: string) => {
    runInAction(() => {
      this.xmpp = client({
        service: this.stores.apiStore.xmppDomains.SERVICE,
        domain: this.stores.apiStore.xmppDomains.DOMAIN,
        username,
        password,
      })
    })
    this.xmpp.start().catch(console.log)
  }

  //to get list of rooms from realm/cache
  getRoomsFromCache = async () => {
    try {
      const rooms: Results<Realm.Object> = await getRoomList()
      runInAction(() => {
        //@ts-ignore
        this.roomList = rooms
      })
    } catch (error) {}
  }

  //get list of messages from Realm/cache
  getCachedMessages = async () => {
    const messages = await getAllMessages()
    //@ts-ignore
    temporaryArchiveMessages = messages
    runInAction(() => {
      //@ts-ignore
      this.messages = messages
    })
  }

  //get cached room info from async
  getCachedRoomsInfo = async () => {
    const res = await asyncStorageGetItem(
      asyncStorageConstants.roomsListHashMap
    )
    if (res) {
      runInAction(() => {
        this.roomsInfoMap = res
      })
    }
  }

  //set unread messages
  setUnreadMessages = (unreadMessagesObject: any) => {
    runInAction(() => {
      this.unreadMessagesForGroups = unreadMessagesObject
    })
  }

  //handle to get user details
  getOtherUserDetails = (props: {
    avatar: string
    name: string
    jid: string
  }) => {
    const { avatar, name, jid } = props
    const anotherUserFirstname = name.split(" ")[0]
    const anotherUserLastname = name.split(" ")[1]
    const manipulatedWalletAddress = jid.split("@")[0]
    const anotherUserWalletAddress = reverseUnderScoreManipulation(
      manipulatedWalletAddress
    )
    //this will get the other user's Avatar and description
    retrieveOtherUserVcard(
      this.stores.loginStore.initialData.xmppUsername,
      jid,
      this.xmpp
    )

    this.stores.loginStore.setOtherUserDetails({
      anotherUserFirstname: anotherUserFirstname,
      anotherUserLastname: anotherUserLastname,
      anotherUserLastSeen: {},
      anotherUserWalletAddress: anotherUserWalletAddress,
      anotherUserAvatar: avatar,
    })
  }

  //to update message counter badge
  updateCounter = () => {
    const notificationsCount: Record<string, number> = {
      official: 0,
      private: 0,
      groups: 0,
    }
    this.roomList?.forEach((item) => {
      const splitedJid = item?.jid?.split("@")[0]
      const isDefaultChat = checkIsDefaultChat(splitedJid)
      if (
        item.participants < 3 &&
        !isDefaultChat &&
        !this.roomsInfoMap[item.jid]?.isFavourite
      ) {
        notificationsCount[ROOM_KEYS.private] +=
          this.roomsInfoMap[item.jid]?.counter || 0
      }

      if (isDefaultChat || this.roomsInfoMap[item.jid]?.isFavourite) {
        notificationsCount[ROOM_KEYS.official] +=
          this.roomsInfoMap[item.jid]?.counter || 0
      }

      if (
        item.participants > 2 &&
        !isDefaultChat &&
        !this.roomsInfoMap[item.jid]?.isFavourite
      ) {
        notificationsCount[ROOM_KEYS.groups] +=
          this.roomsInfoMap[item.jid]?.counter || 0
      }
    })
    this.setUnreadMessages(notificationsCount)
  }

  //update room info/details
  updateRoomInfo = async (jid: string, data: any) => {
    runInAction(() => {
      this.roomsInfoMap[jid] = { ...this.roomsInfoMap[jid], ...data }
      if (data?.isFavourite !== undefined) {
        this.roomsInfoMap.isUpdated += 1
      }
    })
    await asyncStorageSetItem(
      asyncStorageConstants.roomsListHashMap,
      this.roomsInfoMap
    )
  }

  //set current active chat tab
  changeActiveChats = (type: string) => {
    runInAction(() => {
      this.activeChats = type
    })
  }

  //add a new message object in to the message store
  addMessage = (message: any) => {
    if (!this.messages.some((msg: { _id: any }) => msg._id === message._id)) {
      runInAction(() => {
        this.messages.push(message)
      })
    }
  }

  //delete a message object from the message store.
  deleteMessage = (messageId: string) => {
    //delete from Mobx store
    runInAction(() => {
      const index = this.messages.findIndex((item) => item._id === messageId)
      if (index !== -1) {
        this.messages.splice(index, 1)
      }
    })

    //delete from realm store
    deleteMessageObject(messageId).then((success) => {
      console.log("Message deleted from realm", success)
    })
  }

  //edit message text, this called when messages are edited
  editMessage = (replaceMessageId: any, messageString: string) => {
    const indexOfMessage = this.messages.findIndex(
      (item: { _id: any }) => item._id === replaceMessageId
    )
    if (indexOfMessage !== -1) {
      const messages = toJS(this.messages)
      const message = {
        ...JSON.parse(JSON.stringify(messages[indexOfMessage])),
        ["text"]: messageString,
        ["isEdited"]: true,
      }
      message.text = messageString
      runInAction(() => {
        this.messages[indexOfMessage] = message
      })
    }
  }

  setRooms = async (roomsArray: any) => {
    const rooms = await this.checkMetaRooms(roomsArray)
    runInAction(() => {
      this.roomList = rooms
    })
  }

  //update message reply counter
  updateMessageReplyNumbers = (messageId: any) => {
    const messages = toJS(this.messages)
    const index = messages.findIndex(
      (item: { _id: any }) => item._id === messageId
    )
    if (index !== -1) {
      if (messages[index].numberOfReplies) {
        const message = {
          ...JSON.parse(JSON.stringify(messages[index])),
          numberOfReplies: (messages[index].numberOfReplies as number) + 1,
        }
        runInAction(() => {
          this.messages[index] = message
        })
      }
    }
  }

  //update any property of message object, for eg:- update token count number when new tokens received for the message
  updateMessageProperty = (
    messageId: string | undefined,
    property: keyof IMessage,
    value: string | number
  ) => {
    if (!messageId || !value) {
      return
    }

    const messages = toJS(this.messages)
    const index = messages.findIndex(
      (item: { _id: string }) => item._id === messageId
    )

    if (index !== -1) {
      const message = {
        ...JSON.parse(JSON.stringify(messages[index])),
        [property]:
          typeof value === "number" && property === "tokenAmount"
            ? (messages[index][property] as number) + value
            : value,
      }
      runInAction(() => {
        this.messages[index] = message
      })
    }
  }

  //update the message badge counter
  updateBadgeCounter = (roomJid: string, type: "CLEAR" | "UPDATE") => {
    this.roomList.map((item: any) => {
      if (item.jid === roomJid) {
        if (type === "CLEAR") {
          runInAction(() => {
            item.counter = 0
            this.roomsInfoMap[roomJid].counter = 0
          })
        }
        if (type === "UPDATE") {
          runInAction(() => {
            item.counter++
            this.roomsInfoMap[roomJid].counter = item.counter
          })
        }
      }
    })
    this.updateCounter()
  }

  //update the state of typing when user starts typing
  updateMessageComposingState = (props: isComposingProps) => {
    runInAction(() => {
      this.isComposing = props
    })
  }

  updateAllRoomsInfo = async () => {
    const map: any = { isUpdated: 0 }
    this.roomList.forEach((item) => {
      const latestMessage = this.messages
        .filter((message: { roomJid: string }) => item.jid === message.roomJid)
        .sort(
          (
            a: { createdAt: string | number | Date },
            b: { createdAt: string | number | Date }
          ) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]
      if (latestMessage) {
        map[latestMessage?.roomJid] = {
          ...this.roomsInfoMap[latestMessage?.roomJid],

          lastUserName: latestMessage?.user.name,
          lastUserText: latestMessage?.text,
          muted: this.roomsInfoMap[item.jid]?.muted,

          lastMessageTime: latestMessage.createdAt,
        }
      }
      if (!latestMessage) {
        map[item.jid] = this.roomsInfoMap[item.jid]
      }
    })
    runInAction(() => {
      this.roomsInfoMap = map
    })
    await asyncStorageSetItem(
      asyncStorageConstants.roomsListHashMap,
      this.roomsInfoMap
    )
  }

  //loading state update when previous messages are loading.
  setChatMessagesLoading = (value: boolean) => {
    runInAction(() => {
      this.isLoadingEarlierMessages = value
    })
  }

  //subscribes to all default chats mestioned in config
  subscribeToDefaultChats = () => {
    defaultChats.forEach((chat) => {
      const jid = chat.jid + this.stores.apiStore.xmppDomains.CONFERENCEDOMAIN
      const manipulatedWalletAddress = underscoreManipulation(
        this.stores.loginStore.initialData.walletAddress
      )
      subscribeToRoom(jid, manipulatedWalletAddress, this.xmpp)
    })
  }

  //subscribes to all metaRooms mentioned in config
  subscribeToMetaRooms = async () => {
    const cachedRooms = await asyncStorageGetItem("metaRooms")
    const allRooms = cachedRooms || metaRooms
    if (allRooms) {
      allRooms.forEach((room: { idAddress: string }) => {
        subscribeToRoom(
          room.idAddress + this.stores.apiStore.xmppDomains.CONFERENCEDOMAIN,
          underscoreManipulation(
            this.stores.loginStore.initialData.walletAddress
          ),
          this.xmpp
        )
      })
    }
  }

  checkMetaRooms = async (rooms: any[] = []) => {
    const roomsCopy = rooms
    const roomJids = roomsCopy.map((item) => item.jid.split("@")[0])
    try {
      const body = { jids: roomJids }
      const res = await httpPost(
        "/room/check-for-meta-room",
        body,
        this.stores.loginStore.userToken
      )
      for (const item of res.data.results) {
        const roomIndex = roomsCopy.findIndex(
          (r) => r.jid.split("@")[0] === item
        )
        if (roomIndex !== -1) {
          roomsCopy[roomIndex].meta = true
        }
      }
      return roomsCopy
    } catch (error) {
      console.log(error)
      return rooms
    }
  }

  getRoomDetails = (roomJid: string) => {
    return this.roomList.find((item) => item.jid === roomJid)
  }
  //actions

  //xmpp listeners
  xmppListener = async () => {
    let archiveRequestedCounter = 0
    const xmppUsername = underscoreManipulation(
      this.stores.loginStore.initialData.walletAddress
    )
    // xmpp.reconnect.start();
    this.xmpp.on("stanza", async (stanza: any) => {
      //capture room info/details
      if (stanza.attrs.id === "roomInfo") {
        const featureList = stanza.children[0].children.find(
          (item: { attrs: { xmlns: string } }) =>
            item.attrs.xmlns === "jabber:x:data"
        )
        featureList.children &&
          this.updateRoomInfo(stanza.attrs.from, {
            roomDescription: featureList.children.find(
              (item: { attrs: { var: string } }) =>
                item.attrs.var === "muc#roominfo_description"
            ).children[0].children[0],
          })
      }

      if (stanza.attrs.id === XMPP_TYPES.chatLinkInfo) {
        if (stanza.attrs.type !== "error") {
          runInAction(() => {
            this.chatLinkInfo[stanza.attrs.from] =
              stanza.children[0].children[0].attrs.name
          })
        } else {
          showToast("error", "Error", "Chat link info xmpp error", "top")
        }
      }

      //when room description change success response
      if (stanza.attrs.id === XMPP_TYPES.changeRoomDescription) {
        const walletAddress = stanza.attrs.to.split("@")[0]
        getRoomInfo(walletAddress, stanza.attrs.from, this.xmpp)
        showToast("success", "Success", "Description changed", "top")
      }

      //set room image success response
      if (stanza.attrs.id === XMPP_TYPES.setRoomImage) {
        console.log(
          stanza.children[0].attrs,
          stanza.children[0].children,
          stanza
        )
        getUserRoomsStanza(xmppUsername, this.xmpp)
        showToast("success", "Success", "Chat icon set successfully", "bottom")
      }

      //set room background image success response
      if (stanza.attrs.id === XMPP_TYPES.setRoomBackgroundImage) {
        console.log(
          stanza.children[0].attrs,
          stanza.children[0].children,
          stanza
        )
        getUserRoomsStanza(xmppUsername, this.xmpp)
        showToast(
          "success",
          "Success",
          "Chat background set successfully",
          "bottom"
        )
      }

      this.stores.debugStore.addLogsXmpp(stanza)

      //get users vcard details
      if (stanza.attrs.id === XMPP_TYPES.otherUserVCardRequest) {
        let anotherUserAvatar = ""
        let anotherUserDescription = ""
        stanza.children[0].children.map((item: any) => {
          if (item.name === "DESC") {
            anotherUserDescription = item.children[0]
          }
          if (item.name === "PHOTO") {
            anotherUserAvatar = item.children[0].children[0]
          }
        })
        if (anotherUserAvatar && anotherUserDescription)
          this.stores.loginStore.setOtherUserVcard({
            anotherUserAvatar: anotherUserAvatar,
            anotherUserDescription: anotherUserDescription,
          })
      }

      //response when last message of the stack arrived
      if (
        stanza.attrs.id === XMPP_TYPES.paginatedArchive &&
        stanza.children[0].name === "fin"
      ) {
        runInAction(() => {
          this.isLoadingEarlierMessages = false
        })
      }

      //response when last message arrived
      if (
        stanza.attrs.id === "GetArchive" &&
        stanza.children[0].name === "fin"
      ) {
        archiveRequestedCounter += 1
        if (archiveRequestedCounter === this.roomList.length) {
          this.updateAllRoomsInfo()
        }

        this.getCachedMessages()
      }

      //response to request vcard of the current user
      if (stanza.attrs.id === XMPP_TYPES.vCardRequest) {
        const { photo, firstName, lastName } =
          this.stores.loginStore.initialData
        let fullName = firstName + " " + lastName
        let profilePhoto = photo
        let profileDescription = "No description"
        if (!stanza.children[0].children.length) {
          updateVCard(photo, profileDescription, fullName, this.xmpp)
        } else {
          stanza.children[0].children.map((item: any) => {
            if (item.name === "DESC") {
              profileDescription = item.children[0]
            }
            if (item.name === "URL") {
              profilePhoto = item.children[0]
            }
            if (item.name === "FN") {
              fullName = item.children[0]
            }
          })

          this.stores.loginStore.updateUserPhotoAndDescription(
            profilePhoto,
            profileDescription
          )

          this.stores.loginStore.updateUserName(fullName)
        }
      }

      //response to request get current room member details
      if (stanza.attrs.id === XMPP_TYPES.roomMemberInfo) {
        if (stanza.children[0].children.length) {
          runInAction(() => {
            this.roomMemberInfo = stanza.children[0].children.map(
              (item: any) => item.attrs
            )
          })
        }
      }

      //response to presence request, we set roles for each room here
      if (stanza.attrs.id === XMPP_TYPES.roomPresence) {
        const roomJID = stanza.attrs.from.split("/")[0]

        const role = stanza.children[1].children[0].attrs.role
        this.setRoomRoles(roomJID, role)
      }

      //response to request to update vcard details. We then request vcard for updated results
      if (stanza.attrs.id === XMPP_TYPES.updateVCard) {
        if (stanza.attrs.type === "result") {
          vcardRetrievalRequest(xmppUsername, this.xmpp)
        }
      }

      //to catch error
      if (stanza.attrs.type === "error") {
        stanza.children.filter((item: { name: string; children: any[] }) => {
          if (item.name === "error") {
            console.log(item.children, "stanza error==============")
            item.children.filter(
              (subItem: { name: string; children: string[] }) => {
                if (subItem.name === "text") {
                  console.log(subItem.children[0])
                  if (subItem.children[0] === "You are banned in this room!") {
                    showToast(
                      "error",
                      "Banned!",
                      "You have been banned from this room.",
                      "top"
                    )
                  }
                  if (
                    subItem.children[0] === "Traffic rate limit is exceeded"
                  ) {
                    // showToast(
                    //   'error',
                    //   'XMPP: Too much traffic!',
                    //   'Traffic rate limit is exceeded',
                    //   'top',
                    // );
                  }
                }
              }
            )
          }
        })
      }

      //response to request ban user
      if (stanza.attrs.id === XMPP_TYPES.ban) {
        if (stanza.children[0].children[0].attrs.status === "success") {
          showToast("success", "Success", "User banned!", "top")
        }
      }

      //response to request ban user
      if (stanza.attrs.id === "ban_user") {
        this.setUserBanSuccess(true)
        showToast(
          "success",
          "Success",
          `${this.userBanData.name} removed by ${this.userBanData.senderName}`,
          "top"
        )
      }

      //response to create new room request
      if (stanza.attrs.id === XMPP_TYPES.createRoom) {
        getUserRoomsStanza(xmppUsername, this.xmpp)
      }

      //response to get user room request
      if (stanza.attrs.id === XMPP_TYPES.getUserRooms) {
        const roomsArray: any = []
        const rosterFromXmpp = stanza.children[0].children
        rosterFromXmpp.forEach((item: any) => {
          if (!item.attrs.name) {
            return
          }
          const rosterObject = {
            name: item.attrs.name,
            jid: item.attrs.jid,
            participants: +item.attrs.users_cnt,
            avatar: "https://placeimg.com/140/140/any",
            counter: 0,
            lastUserText: "",
            lastUserName: "",
            createdAt: new Date(),
            priority: 0,
            roomThumbnail:
              item.attrs.room_thumbnail === "none"
                ? ""
                : item.attrs.room_thumbnail,
            roomBackground:
              item.attrs.room_background === "none"
                ? ""
                : item.attrs.room_background,
          }

          presenceStanza(xmppUsername, item.attrs.jid, this.xmpp)
          getChatRoom(item.attrs.jid).then((cachedChat: any) => {
            if (!cachedChat) {
              addChatRoom(rosterObject)
              this.updateRoomInfo(item.attrs.jid, {
                name: item.attrs.name,
                participants: +item.attrs.users_cnt,
              })
            }
            if (
              cachedChat?.jid &&
              (+cachedChat.participants !== +item.attrs.users_cnt ||
                cachedChat.name !== item.attrs.name)
            ) {
              this.updateRoomInfo(item.attrs.jid, {
                name: item.attrs.name,
                participants: +item.attrs.users_cnt,
              })
            }
          })

          roomsArray.push(rosterObject)

          //insert the list of rooms in realm
          // insertRosterList(rosterObject);
        })
        await this.setRooms(roomsArray)
        // await AsyncStorage.setItem('roomsArray', JSON.stringify(roomsArray));
      }

      //response to get blacklist user request
      if (stanza.attrs.id === XMPP_TYPES.getBlackList) {
        const blackList = stanza.children[0].children.map(
          (item: {
            attrs: { user: any; date: string | number; fullname: any }
          }) => ({
            userJid: item.attrs.user,
            date: +item.attrs.date * 1000,
            name: item.attrs.fullname,
          })
        )
        runInAction(() => {
          this.blackList = blackList
        })
      }

      //response to add to or remove from blacklist, here we call request black list for updated results
      if (
        stanza.attrs.id === XMPP_TYPES.addToBlackList ||
        stanza.attrs.id === XMPP_TYPES.removeFromBlackList
      ) {
        getBlackList(xmppUsername, this.xmpp)
      }

      //response to delete message request
      if (stanza.attrs.id === XMPP_TYPES.deleteMessage) {
        console.log(stanza.children, "1")
        const deleteMessageId = stanza.children.find(
          (item: {
            attrs: { xmlns?: any; id?: string }
            children: any[]
            name: string
          }) => item.name === "delete"
        ).attrs.id
        this.deleteMessage(deleteMessageId)
      }

      //response to subscribe to room request
      if (stanza.is("iq") && stanza.attrs.id === XMPP_TYPES.newSubscription) {
        presenceStanza(xmppUsername, stanza.attrs.from, this.xmpp)
        const room = await getChatRoom(stanza.attrs.from)
        if (!room) {
          getUserRoomsStanza(xmppUsername, this.xmpp)
        }
      }

      //if stanza is of message type
      if (stanza.is("message")) {
        //capture message composing
        if (
          stanza?.children[0]?.children[0]?.children[0]?.children[2]
            ?.children[0]?.name === "invite"
        ) {
          const jid =
            stanza?.children[0]?.children[0]?.children[0]?.children[3]?.attrs
              ?.jid
          subscribeStanza(xmppUsername, jid, this.xmpp)
          presenceStanza(xmppUsername, jid, this.xmpp)
        }

        //response to invite request
        if (stanza?.children[2]?.children[0]?.name === "invite") {
          const jid = stanza.children[3].attrs.jid
          subscribeStanza(xmppUsername, jid, this.xmpp)
        }

        //response to invite request
        if (stanza?.children[2]?.children[0]?.name === XMPP_TYPES.invite) {
          const jid = stanza.children[3].attrs.jid
          subscribeStanza(xmppUsername, jid, this.xmpp)
          getUserRoomsStanza(xmppUsername, this.xmpp)
        }

        //capture archived message of a room
        if (stanza.children[0].attrs.xmlns === "urn:xmpp:mam:2") {
          const singleMessageDetailArray =
            stanza.children[0].children[0].children[0].children
          const replace = stanza
            .getChild("result")
            ?.getChild("forwarded")
            ?.getChild("message")
            ?.getChild("replaced")
          const message = createMessageObject(singleMessageDetailArray)
          message.isEdited = !!replace

          // if(this.replaceMessageList.find(item => message._id === item.replaceMessageId)){
          //     message.text = item.rep
          // }
          const messageAlreadyExist = this.messages.findIndex(
            (x: { _id: string }) => x._id === message._id
          )
          if (messageAlreadyExist === -1) {
            temporaryArchiveMessages.push(message)
            if (
              this.blackList.find((item) => item.userJid === message.user._id)
                ?.userJid
            ) {
              return
            }

            if (message.system) {
              if (message?.contractAddress && message.nftId) {
                await updateMessageToWrapped(message.receiverMessageId, {
                  nftId: message.nftId,
                  contractAddress: message.contractAddress,
                })
              }

              message.tokenAmount &&
                (await updateTokenAmount(
                  message.receiverMessageId,
                  message.tokenAmount
                ))
            }

            if (message.isReply && message.mainMessage?.id) {
              const thread = temporaryArchiveMessages.filter(
                (item) => item.mainMessage?.id === message.mainMessage?.id
              )
              this.updateMessageProperty(
                message.mainMessage?.id,
                "numberOfReplies",
                thread.length
              )
              await updateNumberOfReplies(message.mainMessage.id, thread.length)
            }

            await insertMessages(message)
            this.addMessage(message)
          }
        }

        //response to when a message is sent to a room
        if (stanza.attrs.id === XMPP_TYPES.sendMessage) {
          const messageDetails = stanza.children
          const message = createMessageObject(messageDetails)
          temporaryArchiveMessages.push(message)
          if (
            this.blackList.find((item) => item.userJid === message.user._id)
              ?.userJid
          ) {
            console.log("finded user")
            return
          }
          if (this.shouldCount) {
            this.updateBadgeCounter(message.roomJid, "UPDATE")
          }
          this.addMessage(message)

          this.updateRoomInfo(message.roomJid, {
            lastUserText: message?.text,
            lastUserName: message?.user?.name,
            lastMessageTime: message?.createdAt,
          })
          if (message.system) {
            if (message?.contractAddress && message.nftId) {
              await updateMessageToWrapped(message.receiverMessageId, {
                nftId: message.nftId,
                contractAddress: message.contractAddress,
              })

              this.updateMessageProperty(
                message.receiverMessageId,
                "nftId",
                message.nftId
              )
            }
            if (message.tokenAmount) {
              this.updateMessageProperty(
                message.receiverMessageId,
                "tokenAmount",
                message.tokenAmount
              )
              await updateTokenAmount(
                message.receiverMessageId,
                message.tokenAmount
              )
              playCoinSound(message.tokenAmount)
            }
          }
          if (message.isReply && message.mainMessage?.id) {
            const thread = temporaryArchiveMessages.filter(
              (item) => item.mainMessage?.id === message.mainMessage?.id
            )
            this.updateMessageProperty(
              message.mainMessage?.id,
              "numberOfReplies",
              thread.length
            )
            await updateNumberOfReplies(message?.mainMessage?.id, thread.length)
          }
          await insertMessages(message)
        }

        //response to when a message is edited
        if (stanza.attrs.id === XMPP_TYPES.replaceMessage) {
          const replaceMessage: { text: string; id: string } =
            stanza.children.find((item) => item.name === "replace").attrs
          const replaceMessageId = replaceMessage.id
          const replaceMessageText = replaceMessage.text

          this.editMessage(replaceMessageId, replaceMessageText)
          await updateMessageText(replaceMessageId, replaceMessageText)
        }

        //capture message composing
        if (stanza.attrs.id === XMPP_TYPES.isComposing) {
          const chatJID = stanza.attrs.from.split("/")[0]

          const fullName = stanza.children[1].attrs.fullName
          const manipulatedWalletAddress =
            stanza.children[1].attrs.manipulatedWalletAddress
          this.updateMessageComposingState({
            state: true,
            username: fullName,
            manipulatedWalletAddress,
            chatJID,
          })
        }

        //capture message composing paused
        if (stanza.attrs.id === XMPP_TYPES.pausedComposing) {
          const chatJID = stanza.attrs.from.split("/")[0]
          const manipulatedWalletAddress =
            stanza.children[1].attrs.manipulatedWalletAddress
          this.updateMessageComposingState({
            state: false,
            manipulatedWalletAddress,
            chatJID,
            username: "",
          })
        }
      }
    })

    //listener when xmpp is online
    this.xmpp.on("online", async () => {
      //set reconnect delay in ms
      this.xmpp.reconnect.delay = 2000

      //send presence
      this.xmpp.send(xml("presence"))

      //subscribe to default chats mentioned in the config
      this.subscribeToDefaultChats()

      //set online status true in the mobx store
      runInAction(() => {
        this.isOnline = true
      })

      //subscribe to meta rooms
      this.subscribeToMetaRooms()

      //get blacklist
      getBlackList(xmppUsername, this.xmpp)

      //retrive user vcard details for profile
      vcardRetrievalRequest(xmppUsername, this.xmpp)

      //get list of rooms user subscribed to.
      getUserRoomsStanza(xmppUsername, this.xmpp)
    })
  }
}
