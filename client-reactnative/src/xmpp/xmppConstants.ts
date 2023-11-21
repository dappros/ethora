export const SERVICE = "wss://dxmpp.com:5443/ws" // dx
export const DOMAIN = "dxmpp.com" //dx
export const CONFERENCEDOMAIN_WITHOUT = "conference.dxmpp.com" //dev
export const CONFERENCEDOMAIN = "@conference.dxmpp.com" //dev

export const archivedXmlns = "urn:xmpp:mam:2"
export const realtimeXmlns = "urn:xmpp:mam:tmp"
export const realtimeMessageId = "sendMessage"
export const editMessageId = "editMessage"

export const XMPP_TYPES = {
  newSubscription: "newSubscription",
  subscriptionsStanzaID: "subscriptions",
  invite: "invite",
  getUserRooms: "getUserRooms",
  sendMessage: "sendMessage",
  subscriptions: "subscriptions",
  userRooms: "userRooms",
  unsubscribeFromRoom: "unsubscribeFromRoom",
  participants: "participants",
  createRoom: "createRoom",
  roomPresence: "roomPresence",
  vCardRequest: "vCardRequest",
  otherUserVCardRequest: "otherUserVCardRequest",
  updateVCard: "updateVCard",
  updateUserProfile: "updateUserProfile",
  isComposing: "isComposing",
  pausedComposing: "pausedComposing",
  commonDiscover: "commonDiscover",
  setOwner: "setOwner",
  roomConfig: "roomConfig",
  botStanza: "botStanza",
  roomInfo: "roomInfo",
  chatLinkInfo: "chatLinkInfo",
  paginatedArchive: "paginatedArchive",
  getBlackList: "blackList",
  addToBlackList: "addToBlackList",
  removeFromBlackList: "removeFromBlackList",
  roomMemberInfo: "roomMemberInfo",
  setRoomImage: "setRoomImage",
  setRoomBackgroundImage: "setRoomBackgroundImage",
  deleteMessage: "deleteMessage",
  changeRoomBackground: "changeRoomBackground",
  ban: "ban",
  unBan: "unban",
  assignModerator: "mod1",
  unAssignModerator: "mod2",
  getBannedUserListOfRoom: "getBannedUserListOfRoom",
  changeRoomDescription: "changeRoomDescription",
  replaceMessage: "replaceMessage",
}
