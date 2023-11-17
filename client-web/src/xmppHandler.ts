import {
  replaceMessageListItemProps as replaceMessageListItemProperties,
  TActiveRoomFilter,
  TMessageHistory,
  TRoomRoles,
  TUserChatRooms,
  useStoreState,
} from "./store"
import { Element } from "ltx"
import { xml } from "@xmpp/client"
import { sendBrowserNotification } from "./utils"
import { createMessage } from "./utils/createMessage"
import { history } from "./utils/history"
import { walletToUsername } from "./utils/walletManipulation"
import { XmppClass } from "./xmpp"
import { playCoinSound } from "./utils/playCoinSound"

export class XmppHandler {
  public lastMsgId: string = ""
  public isGettingMessages: boolean = false
  public isGettingFirstMessages: boolean = false
  private temporaryMessages: TMessageHistory[] = []
  private temporaryReplaceMessages: replaceMessageListItemProperties[] = []
  private lastRomJIDLoading: string = ""

  getRoomGroup = (jid: string, userCount: number): TActiveRoomFilter => {
    const chats = useStoreState.getState().defaultChatRooms
    const chatsMap = {}
    for (const c of chats) {
      chatsMap[c.jid] = c
    }
    if (chatsMap[jid]) {
      return "official"
    }
    return "groups"
  }

  onRealtimeMessage = async (stanza: Element) => {
    if (stanza.attrs.id === "sendMessage") {
      const body = stanza?.getChild("body")
      const data = stanza?.getChild("data")
      const replace = stanza?.getChild("replaced")
      const archived = stanza?.getChild("archived")
      const id = stanza.getChild("archived")?.attrs.id
      if (!data || !body || !id) {
        return
      }

      if (
        !data.attrs.senderFirstName ||
        !data.attrs.senderLastName ||
        !data.attrs.senderJID
      ) {
        return
      }

      const message = createMessage(data, body, id, stanza.attrs.from)
      const blackList = useStoreState
        .getState()
        .blackList.find((item) => item.user === message.data.senderJID)

      if (blackList) {
        return
      }

      if (data.attrs.isReply) {
        const messageId = Number(message.data?.mainMessage?.id)
        useStoreState.getState().setNumberOfReplies(messageId)
      }
      useStoreState.getState().updateMessageHistory(message)
      const isCurrentUser =
        message.data.senderWalletAddress ===
        useStoreState.getState().user.walletAddress
      if (message.data.isSystemMessage === "true") {
        playCoinSound(+message.data.tokenAmount)
      }
      if (!isCurrentUser) {
        useStoreState.getState().updateCounterChatRoom(data.attrs.roomJid)
        sendBrowserNotification(message.body, () => {
          history.push("/chat/" + message.roomJID.split("@")[0])
        })
      }
    }
  }
  onPrivateXml = (stanza: any) => {
    if (stanza.attrs.id === "privateXml") {
      const rooms = stanza.children[0]?.children[0]?.children[0]?.children[0]
      if (rooms) {
        const parsedRooms: TUserChatRooms[] = JSON.parse(rooms)

        for (const room of parsedRooms) {
          useStoreState.getState().updateUserChatRoom(room)
        }
      }
    }
  }
  onMessageHistory = async (stanza: any) => {
    console.log("<===", stanza.toString())
    if (
      stanza.is("message") &&
      stanza.children[0].attrs.xmlns === "urn:xmpp:mam:2"
    ) {
      const body = stanza
        .getChild("result")
        ?.getChild("forwarded")
        ?.getChild("message")
        ?.getChild("body")
      const data = stanza
        .getChild("result")
        ?.getChild("forwarded")
        ?.getChild("message")
        ?.getChild("data")
      const delay = stanza
        .getChild("result")
        ?.getChild("forwarded")
        ?.getChild("delay")
      const replace = stanza
        .getChild("result")
        ?.getChild("forwarded")
        ?.getChild("message")
        ?.getChild("replaced")

      const id = stanza.getChild("result")?.attrs.id
      if (!data || !body || !delay || !id) {
        return
      }

      if (
        !data.attrs.senderFirstName ||
        !data.attrs.senderLastName ||
        !data.attrs.senderJID
      ) {
        return
      }

      const message = createMessage(data, body, id, stanza.attrs.from)
      message.data.isEdited = !!replace
      // console.log('TEST ', data.attrs)
      const blackList = useStoreState
        .getState()
        .blackList.find((item) => item.user === message.data.senderJID)

      if (blackList) {
        return
      }
      if (!this.isGettingMessages) {
        //check for messages in temp Replace message array agains the current stanza message id
        const replaceItem = this.temporaryReplaceMessages.find(
          (item) => item.replaceMessageId === message.id
        )
        //if exists then replace the body with current stanza body
        if (replaceItem) {
          message.body = replaceItem.replaceMessageText
        }
        useStoreState.getState().setNewMessageHistory(message)
        useStoreState.getState().sortMessageHistory()
      }

      const untrackedRoom = useStoreState.getState().currentUntrackedChatRoom
      if (
        stanza.attrs.to.split("@")[0] !== data.attrs.senderJID.split("@")[0] &&
        stanza.attrs.from.split("@")[0] !== untrackedRoom.split("@")[0] &&
        !this.isGettingFirstMessages &&
        data.attrs.roomJid
      ) {
        // useStoreState.getState().updateCounterChatRoom(data.attrs.roomJid);
      }
      if (data.attrs.isReply) {
        const messageid = message.data.mainMessage?.id
        useStoreState.getState().setNumberOfReplies(messageid)
        this.updateTemporaryMessagesRepliesCount(messageid)
      }
    }
  }
  updateTemporaryMessagesRepliesCount = (messageId: number) => {
    const messageIndex = this.temporaryMessages.findIndex(
      (item) => item.id === messageId
    )
    if (!messageId || isNaN(messageId) || messageIndex === -1) {
      return
    }
    const threadMessages = this.temporaryMessages.filter(
      (item) => item.data.mainMessage?.id === messageId
    )
    this.temporaryMessages[messageIndex].numberOfReplies = threadMessages
  }

  onLastMessageArchive = (stanza: Element, xmpp: any) => {
    if (
      stanza.attrs.id === "paginatedArchive" ||
      stanza.attrs.id === "GetArchive"
    ) {
      this.lastMsgId = String(
        stanza.getChild("fin")?.getChild("set")?.getChild("last")?.children[0]
      )

      if (stanza.attrs.type === "error" || stanza.name === "iq") {
        useStoreState.getState().setLoaderArchive(false)
        console.log("ERROR:", stanza.attrs.type, stanza)
      }

      if (stanza.getChild("fin")) {
        // if (!this.isGettingMessages) {
        useStoreState.getState().updateMessageHistory(this.temporaryMessages)
        this.isGettingMessages = false

        for (const item of this.temporaryMessages) {
          if (item.data.isSystemMessage && item.data.tokenAmount > 0) {
            useStoreState
              .getState()
              .updateCoinsInMessageHistory(
                Number(item.data.receiverMessageId),
                String(item.data.senderJID),
                Number(item.data.tokenAmount)
              )
          }
        }

        useStoreState.getState().setLoaderArchive(false)
        this.temporaryMessages = []
        this.isGettingFirstMessages = false
      }

      if (
        this.lastRomJIDLoading &&
        this.lastRomJIDLoading === stanza.attrs.from
      ) {
        useStoreState.getState().setLoaderArchive(false)
        this.lastRomJIDLoading = ""
        this.isGettingFirstMessages = false
      }
    }
  }

  onGetLastMessageArchive = (stanza: Element, xmpp: any) => {
    if (stanza.attrs.id === "sendMessage") {
      const data = stanza.getChild("stanza-id")
      if (data) {
        xmpp.getLastMessageArchive(data.attrs.by)
        return
      }
      return this.onMessageHistory(stanza)
    }
  }

  onGetRoomInfo = (stanza: Element | any) => {
    const userChatRooms = useStoreState.getState().userChatRooms
    const currentRoomData = userChatRooms.find(
      (e) => e.jid === stanza.attrs.from
    )
    if (
      stanza.attrs.id === "roomInfo" &&
      stanza.children[0] &&
      currentRoomData
    ) {
      const featureList = stanza.children[0].children.find(
        (item) => item.attrs.xmlns === "jabber:x:data"
      )
      const roomDescription = featureList.children.find(
        (item) => item.attrs.var === "muc#roominfo_description"
      ).children[0]?.children[0]
      const roomName = featureList.children.find(
        (item) => item.attrs.var === "muc#roomconfig_roomname"
      ).children[0]?.children[0]

      const roomData = {
        jid: currentRoomData.jid,
        name: roomName,
        room_background: currentRoomData.room_background,
        room_thumbnail: currentRoomData.room_thumbnail,
        users_cnt: currentRoomData.users_cnt,
        unreadMessages: currentRoomData.unreadMessages,
        composing: currentRoomData.composing,
        toUpdate: currentRoomData.toUpdate,
        description: roomDescription,
      }
      useStoreState.getState().updateUserChatRoom(roomData)
    }
  }

  onGetRoomMemberInfo = (stanza: Element | any) => {
    if (stanza.attrs.id === "roomMemberInfo" && stanza.children.length > 0) {
      const info = stanza.children[0].children.map((item) => item.attrs)
      useStoreState.getState().setRoomMemberInfo(info)
    }
  }

  onChangeDescription = (stanza: Element, xmpp: any) => {
    if (stanza.attrs.id === "changeRoomDescription") {
      // console.log(stanza)
      xmpp.getRoomInfo(stanza.attrs.from)
    }
  }

  onChangeRoomName = (stanza: Element, xmpp: any) => {
    if (stanza.attrs.id === "changeRoomName") {
      xmpp.getRoomInfo(stanza.attrs.from)
    }
  }

  onPresenceInRoom = (stanza: Element | any) => {
    if (stanza.attrs.id === "presenceInRoom") {
      const roomJID: string = stanza.attrs.from.split("/")[0]
      const role: string = stanza?.children[1]?.children[0]?.attrs.role
      const elementObject: TRoomRoles = { roomJID: roomJID, role: role }
      useStoreState.getState().setRoomRoles(elementObject)
    }
  }

  connectToUserRooms = (stanza: Element, xmpp: any) => {
    if (
      stanza.attrs.id === "getUserRooms" &&
      stanza.getChild("query")?.children
    ) {
      this.isGettingFirstMessages = true
      // useStoreState.getState().setLoaderArchive(true);
      let roomJID: string = ""
      stanza.getChild("query")?.children.forEach((result: any) => {
        const currentChatRooms = useStoreState.getState().userChatRooms

        if (result?.attrs.name) {
          const currentSavedChatRoom = currentChatRooms.filter(
            (element) => element.jid === result?.attrs.jid
          )
          if (
            currentSavedChatRoom.length === 0 ||
            currentSavedChatRoom[0].toUpdate
          ) {
            roomJID = result.attrs.jid
            xmpp.presenceInRoom(roomJID)
            const roomData: TUserChatRooms = {
              jid: roomJID,
              name: result?.attrs.name,
              room_background: result?.attrs.room_background,
              room_thumbnail: result?.attrs.room_thumbnail,
              users_cnt: result?.attrs.users_cnt,
              unreadMessages: 0,
              composing: "",
              toUpdate: false,
              description: "",
              group: this.getRoomGroup(roomJID, +result?.attrs.users_cnt),
            }
            if (
              currentSavedChatRoom.length > 0 &&
              currentSavedChatRoom[0].toUpdate
            ) {
              useStoreState.getState().updateUserChatRoom(roomData)
            } else {
              useStoreState.getState().setNewUserChatRoom(roomData)
            }
            //get message history in the room
            xmpp.getRoomArchiveStanza(roomJID, 1)
            this.lastRomJIDLoading = roomJID
          }
        }
      })
    }
  }

  onComposing = (stanza: Element) => {
    if (
      stanza.attrs.id === "isComposing" ||
      stanza.attrs.id === "pausedComposing"
    ) {
      const requestType = stanza.attrs.id
      const recipientID = String(stanza.attrs.to).split("@")[0]
      const senderID = stanza.getChild("data").attrs.manipulatedWalletAddress

      if (recipientID === walletToUsername(senderID)) {
        return
      }

      if (requestType === "isComposing") {
        useStoreState
          .getState()
          .updateComposingChatRoom(
            stanza.attrs.from.toString().split("/")[0],
            true,
            stanza.getChild("data").attrs.fullName
          )

        setTimeout(
          () =>
            useStoreState
              .getState()
              .updateComposingChatRoom(
                stanza.attrs.from.toString().split("/")[0],
                false
              ),
          1500
        )
      }

      if (stanza.attrs.id === "pausedComposing") {
        useStoreState
          .getState()
          .updateComposingChatRoom(
            stanza.attrs.from.toString().split("/")[0],
            false
          )
      }
    }
  }

  getListOfRooms = (xmpp: any) => {
    useStoreState.getState().clearUserChatRooms()
    useStoreState.getState().setCurrentUntrackedChatRoom("")
    useStoreState.getState().clearBlackList()

    xmpp.client.send(xml("presence"))
    xmpp.getArchive(xmpp.client?.jid?.toString())
    const chats = useStoreState.getState().defaultChatRooms
    for (const chat of chats) {
      xmpp.presenceInRoom(chat.jid)
    }
    xmpp.getRooms()
    xmpp.getBlackList()
    useStoreState.getState().clearMessageHistory()
  }

  onInvite = (stanza: Element, xmpp: any) => {
    if (stanza.is("message")) {
      const isArchiveInvite = stanza
        .getChild("result")
        ?.getChild("forwarded")
        ?.getChild("message")
        ?.getChild("x")
        ?.getChild("invite")
      if (stanza.getChild("x")?.getChild("invite") || isArchiveInvite) {
        let jid = stanza.attrs.from
        if (isArchiveInvite) {
          jid = stanza
            .getChild("result")
            ?.getChild("forwarded")
            ?.getChild("message").attrs.from
        }
        const currentChatRooms = useStoreState.getState().userChatRooms
        if (
          currentChatRooms.filter((element) => element.jid === jid).length === 0
        ) {
          xmpp.subsribe(jid)
          xmpp.presenceInRoom(jid)
          xmpp.getRooms()
        }
      } else {
      }
    } else {
    }
  }

  onBlackList = (stanza: Element, xmpp: any) => {
    if (stanza.attrs.id === "blackList") {
      const blackList = stanza?.getChild("query").children.map((item: any) => ({
        date: Number(item.attrs.date),
        fullName: item.attrs.fullname,
        user: item.attrs.user,
      }))
      useStoreState.getState().saveInBlackList(blackList)
    }
  }

  onRemoveFromBlackList = (stanza: Element, xmpp: any) => {
    if (stanza.attrs.id === "removeFromBlackList") {
      console.log(stanza)
    }
  }
  onNewSubscription = (stanza: Element, xmpp: XmppClass) => {
    if (stanza.attrs.id === "newSubscription") {
      xmpp.getRooms()
    }
  }
  onRoomDesignChange = (stanza: Element, xmpp: XmppClass) => {
    if (stanza.attrs.id === "unsubscribe") {
      xmpp.getRooms()
    }
    if (
      stanza.attrs.id === "setRoomImage" ||
      stanza.attrs.id === "setRoomBackground"
    ) {
      xmpp.getRoomInfo(stanza.attrs.from)
    }
  }

  onBan = (stanza: Element) => {
    if (stanza.attrs.id === "ban") {
      console.log(stanza, "ban stanza")
    }
  }

  //when messages are edited in realtime then capture broadcast with id "replaceMessage" and replace the text.
  onSendReplaceMessageStanza = (stanza: any) => {
    if (stanza.attrs.id === "replaceMessage") {
      const replaceMessage: { text: string; id: string } = stanza.children.find(
        (item) => item.name === "replace"
      ).attrs
      const messageString = replaceMessage?.text
      useStoreState.getState().replaceMessage(+replaceMessage.id, messageString)
    }
  }

  //when delete request is sent this listener will capture
  onDeleteMessageStanza = (stanza: any) => {
    if (stanza.attrs.id === "deleteMessageStanza") {
      console.log(stanza, "delete response")
    }
  }
}
