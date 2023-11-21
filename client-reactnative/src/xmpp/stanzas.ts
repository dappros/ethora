import { xml } from "@xmpp/client"
import { ApiStore } from "../stores/apiStore"
import { XMPP_TYPES } from "./xmppConstants"
const store = new ApiStore()

const DOMAIN = store.xmppDomains.DOMAIN
const CONFERENCEDOMAIN_WITHOUT = store.xmppDomains.CONFERENCEDOMAIN_WITHOUT
const CONFERENCEDOMAIN = store.xmppDomains.CONFERENCEDOMAIN

export const subscribeStanza = (from: string, to: string, xmpp: any) => {
  const subscribe = xml(
    "iq",
    {
      from: from + "@" + DOMAIN,
      to: to,
      type: "set",
      id: XMPP_TYPES.newSubscription,
    },
    xml(
      "subscribe",
      {
        xmlns: "urn:xmpp:mucsub:0",
        nick: from,
      },
      xml("event", { node: "urn:xmpp:mucsub:nodes:messages" }),
      xml("event", { node: "urn:xmpp:mucsub:nodes:subject" })
    )
  )
  xmpp.send(subscribe)
}

export const presenceStanza = (from: string, to: string, xmpp: any) => {
  const presence = xml(
    "presence",
    {
      from: from + "@" + DOMAIN,
      to: to + "/" + from,
      id: XMPP_TYPES.roomPresence,
    },
    xml("x", "http://jabber.org/protocol/muc")
  )
  xmpp.send(presence)
}
export const getUserRoomsStanza = (
  manipulatedWalletAddress: string,
  xmpp: any
) => {
  const message = xml(
    "iq",
    {
      type: "get",
      from: manipulatedWalletAddress + "@" + DOMAIN,
      id: XMPP_TYPES.getUserRooms,
    },
    xml("query", { xmlns: "ns:getrooms" })
  )
  xmpp.send(message)
}

export const blacklistUser = (
  manipulatedWalletAddress: string,
  userAddressToBlacklist: string,
  xmpp: any
) => {
  const stanza = xml(
    "iq",
    {
      from: manipulatedWalletAddress + "@" + DOMAIN,

      type: "set",
      id: XMPP_TYPES.addToBlackList,
    },
    xml("query", {
      xmlns: "ns:deepx:muc:user:block",
      user: userAddressToBlacklist + "@" + DOMAIN,
    })
  )

  xmpp.send(stanza)
}

export const removeUserFromBlackList = (
  manipulatedWalletAddress: string,
  userAddressToRemoveFromBlacklist: string,
  xmpp: any
) => {
  const stanza = xml(
    "iq",
    {
      from: manipulatedWalletAddress + "@" + DOMAIN,
      type: "set",
      id: XMPP_TYPES.removeFromBlackList,
    },
    xml("query", {
      xmlns: "ns:deepx:muc:user:unblock",
      user: userAddressToRemoveFromBlacklist + "@" + DOMAIN,
    })
  )

  xmpp.send(stanza)
}

export const getBlackList = (manipulatedWalletAddress: string, xmpp: any) => {
  const stanza = xml(
    "iq",
    {
      from: manipulatedWalletAddress + "@" + DOMAIN,
      type: "get",
      id: XMPP_TYPES.getBlackList,
    },
    xml("query", {
      xmlns: "ns:deepx:muc:user:blocklist",
    })
  )

  xmpp.send(stanza)
}
/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

//For now only subscibed muc are being fetched
export const sendMessageStanza = (
  from: string,
  to: string,
  messageText: string,
  data: any,
  xmpp: any
) => {
  const message = xml(
    "message",
    {
      id: XMPP_TYPES.sendMessage,
      type: "groupchat",
      from: from + "@" + DOMAIN,
      to: to,
    },
    xml("body", {}, messageText),
    xml("data", {
      xmlns: "http://" + DOMAIN,
      senderJID: from + "@" + DOMAIN,
      ...data,
    })
  )
  xmpp.send(message)
}

export const sendReplaceMessageStanza = (
  from: string,
  to: string,
  replaceText: string,
  messageId: string,
  data: any,
  xmpp: any
) => {
  //send edited message
  // <message from="olek@localhost" id="1635229272917013" to="test_olek@conference.localhost" type="groupchat">
  //   <body>Wow</body>
  //   <replace id="1635229272917013" xmlns="urn:xmpp:message-correct:0"/>
  // </message>
  const message = xml(
    "message",
    {
      from: from + "@" + DOMAIN,
      id: XMPP_TYPES.replaceMessage,
      type: "groupchat",
      to: to,
    },

    xml("replace", {
      id: messageId,
      xmlns: "urn:xmpp:message-correct:0",
      text: replaceText,
    })
  )

  xmpp.send(message)
}

export const sendMediaMessageStanza = async (
  from: string,
  to: string,
  data: any,
  xmpp: any
) => {
  const message = xml(
    "message",
    {
      id: XMPP_TYPES.sendMessage,
      type: "groupchat",
      from: from + "@" + DOMAIN,
      to: to,
    },
    xml("body", {}, "media"),
    xml("store", { xmlns: "urn:xmpp:hints" }),
    xml("data", {
      xmlns: "http://" + DOMAIN,
      senderJID: from + "@" + DOMAIN,
      isSystemMessage: false,
      tokenAmount: "0",
      receiverMessageId: "0",
      isMediafile: true,
      ...data,
    })
  )

  await xmpp.send(message)
}

export const fetchRosterlist = (
  walletAddress: string,
  stanzaId: string,
  xmpp: any
) => {
  const message = xml(
    "iq",
    {
      from: walletAddress + "@" + DOMAIN,
      to: CONFERENCEDOMAIN_WITHOUT,
      type: "get",
      id: stanzaId,
    },
    xml("subscriptions", "urn:xmpp:mucsub:0")
  )

  xmpp.send(message)
}
export const getPaginatedArchive = (
  chat_jid: string,
  firstUserMessageID: string,
  xmpp: any
) => {
  const message = xml(
    "iq",
    {
      type: "set",
      to: chat_jid,
      id: XMPP_TYPES.paginatedArchive,
    },
    xml(
      "query",
      { xmlns: "urn:xmpp:mam:2" },
      xml(
        "set",
        { xmlns: "http://jabber.org/protocol/rsm" },
        xml("max", {}, 25),
        xml("before", {}, firstUserMessageID)
      )
    )
  )
  xmpp.send(message)
}

export const getLastMessageArchive = (chat_jid: string, xmpp: any) => {
  const message = xml(
    "iq",
    {
      type: "set",
      to: chat_jid,
      id: "GetArchive",
    },
    xml(
      "query",
      { xmlns: "urn:xmpp:mam:2" },
      xml(
        "set",
        { xmlns: "http://jabber.org/protocol/rsm" },
        xml("max", {}, 1),
        xml("before")
      )
    )
  )
  xmpp?.send(message)
}

export const subscribeToRoom = (
  roomJID: string,
  manipulatedWalletAddress: string,
  xmpp: any
) => {
  const message = xml(
    "iq",
    {
      from: manipulatedWalletAddress + "@" + DOMAIN,
      to: roomJID,
      type: "set",
      id: XMPP_TYPES.newSubscription,
    },
    xml(
      "subscribe",
      { xmlns: "urn:xmpp:mucsub:0", nick: manipulatedWalletAddress },
      xml("event", { node: "urn:xmpp:mucsub:nodes:messages" }),
      xml("event", { node: "urn:xmpp:mucsub:nodes:presence" }),
      xml("event", { node: "urn:xmpp:mucsub:nodes:subscribers" }),
      xml("event", { node: "urn:xmpp:mucsub:nodes:subject" })
    )
  )

  xmpp.send(message)
}
export const unsubscribeFromChatXmpp = (
  manipulatedWalletAddress: string,
  jid: string,
  xmpp: any
) => {
  const message = xml(
    "iq",
    {
      from: manipulatedWalletAddress + "@" + DOMAIN,
      to: jid,
      type: "set",
      id: XMPP_TYPES.unsubscribeFromRoom,
    },
    xml(
      "unsubscribe",
      {
        xmlns: "urn:xmpp:mucsub:0",
        // nick: nickName,
      },
      xml("event", { node: "urn:xmpp:mucsub:nodes:messages" }),
      xml("event", { node: "urn:xmpp:mucsub:nodes:subject" })
    )
  )
  xmpp.send(message)
}
export const leaveRoomXmpp = (
  manipulatedWalletAddress: string,
  jid: string,
  username: string,
  xmpp: any
) => {
  const presence = xml("presence", {
    from: manipulatedWalletAddress + "@" + DOMAIN,
    to: jid + "/" + username,
    type: "unavailable",
  })
  xmpp.send(presence)
}
export const getRoomArchiveStanza = (chat_jid: string, xmpp: any) => {
  const message = xml(
    "iq",
    {
      type: "set",
      to: chat_jid,
      id: "GetArchive",
    },
    xml(
      "query",
      { xmlns: "urn:xmpp:mam:2" },
      xml(
        "set",
        { xmlns: "http://jabber.org/protocol/rsm" },
        xml("max", {}, 30),
        xml("before")
      )
    )
  )
  xmpp.send(message)
}
export const get_list_of_subscribers = (
  chat_jid: string,
  walletAddress: string,
  xmpp: any
) => {
  const message = xml(
    "iq",
    {
      from: walletAddress + "@" + DOMAIN,
      to: chat_jid,
      type: "get",
      id: XMPP_TYPES.participants,
    },
    xml("subscriptions", "urn:xmpp:mucsub:0")
  )
  xmpp.send(message)
}

export const roomConfigurationForm = (
  user_jid: string,
  chat_jid: string,
  roomConfig: any,
  xmpp: any
) => {
  const message = xml(
    "iq",
    {
      from: user_jid + "@" + DOMAIN,
      id: "create2",
      to: chat_jid,
      type: "set",
    },
    xml(
      "query",
      { xmlns: "http://jabber.org/protocol/muc#owner" },
      xml(
        "x",
        { xmlns: "jabber:x:data", type: "submit" },
        xml(
          "field",
          { var: "FORM_TYPE" },
          xml("value", {}, "http://jabber.org/protocol/muc#roomconfig")
        ),
        xml(
          "field",
          { var: "muc#roomconfig_roomname" },
          xml("value", {}, roomConfig.roomName)
        )
      )
    )
  )

  xmpp.send(message)
}

export const getRoomInfo = (
  walletAddress: string,
  chat_jid: string,
  xmpp: any
) => {
  const message = xml(
    "iq",
    {
      from: walletAddress + "@" + DOMAIN,
      id: XMPP_TYPES.roomInfo,
      to: chat_jid,
      type: "get",
    },
    xml("query", { xmlns: "http://jabber.org/protocol/disco#info" })
  )

  xmpp.send(message)
}

export const getChatLinkInfo = (
  walletAddress: string,
  chat_jid: string,
  xmpp: any
) => {
  const message = xml(
    "iq",
    {
      from: walletAddress + "@" + DOMAIN,
      id: XMPP_TYPES.chatLinkInfo,
      to: chat_jid,
      type: "get",
    },
    xml("query", { xmlns: "http://jabber.org/protocol/disco#info" })
  )

  xmpp.send(message)
}

export const isComposing = async (
  walletAddress: string,
  chat_jid: string,
  fullName: string,
  xmpp: any
) => {
  // <message
  // from='bernardo@shakespeare.lit/pda'
  // to='francisco@shakespeare.lit/elsinore'
  // type='chat'>
  //     <composing xmlns='http://jabber.org/protocol/chatstates'/>
  // </message>
  const message = xml(
    "message",
    {
      from: walletAddress + "@" + DOMAIN,
      to: chat_jid,
      id: XMPP_TYPES.isComposing,
      type: "groupchat",
    },
    xml("composing", {
      xmlns: "http://jabber.org/protocol/chatstates",
    }),
    xml("data", {
      xmlns: "http://" + DOMAIN,
      fullName: fullName,
      manipulatedWalletAddress: walletAddress,
    })
  )

  // setTimeout((, xmpp) => {
  xmpp.send(message)
  // }, 100);
}
export const botStanza = (from: string, to: string, data: any, xmpp: any) => {
  const message = xml(
    "message",
    {
      id: XMPP_TYPES.botStanza,
      type: "groupchat",
      from: from + "@" + DOMAIN,
      to: to,
    },
    xml("body", {}, ""),
    xml("data", {
      xmlns: "http://" + DOMAIN,
      senderJID: from + "@" + DOMAIN,
      ...data,
    })
  )
  xmpp.send(message)
}
export const pausedComposing = async (
  walletAddress: string,
  chat_jid: string,
  xmpp: any
) => {
  //     <message
  //     from='romeo@montague.net/orchard'
  //     to='juliet@capulet.com/balcony'
  //     type='chat'>
  //   <thread>act2scene2chat1</thread>
  //   <paused xmlns='http://jabber.org/protocol/chatstates'/>

  // </message>
  const message = xml(
    "message",
    {
      from: walletAddress + "@" + DOMAIN,
      to: chat_jid,
      id: XMPP_TYPES.pausedComposing,
      type: "groupchat",
    },
    xml("paused", {
      xmlns: "http://jabber.org/protocol/chatstates",
    }),
    xml("data", {
      xmlns: "http://" + DOMAIN,
      manipulatedWalletAddress: walletAddress,
    })
  )

  xmpp.send(message)
}

export const activeChatState = async (
  walletAddress: string,
  chat_jid: string,
  xmpp: any
) => {
  // <message
  //     from='bernardo@shakespeare.lit/pda'
  //     to='francisco@shakespeare.lit/elsinore'
  //     type='chat'>
  // <body>Long live the king!</body>
  // <active xmlns='http://jabber.org/protocol/chatstates'/>
  // </message>

  const message = xml(
    "message",
    {
      from: walletAddress + "@" + DOMAIN,
      to: chat_jid,
      id: XMPP_TYPES.pausedComposing,
      type: "groupchat",
    },
    xml("active", {
      xmlns: "http://jabber.org/protocol/chatstates",
    })
  )

  xmpp.send(message)
}

export const commonDiscover = (
  walletAddress: string,
  chat_jid: string,
  xmpp: any
) => {
  //     <iq from='romeo@shakespeare.lit/orchard'
  //     id='disco1'
  //     to='juliet@capulet.com/balcony'
  //     type='get'>
  //   <query xmlns='http://jabber.org/protocol/disco#info'/>
  // </iq>

  const message = xml(
    "iq",
    {
      from: walletAddress + "@" + DOMAIN,
      to: chat_jid,
      id: XMPP_TYPES.commonDiscover,
      type: "get",
    },
    xml("query", {
      xmlns: "http://jabber.org/protocol/disco#info",
    })
  )

  xmpp.send(message)
}

export const discoverProfileSupport = (
  walletAddress: string,
  chat_jid: string,
  xmpp: any
) => {
  //     <iq type='get'
  //     from='hamlet@denmark.lit/elsinore'
  //     to='shakespeare.lit'
  //     id='iq1'>
  //   <profile xmlns='urn:xmpp:tmp:profile'/>
  // </iq>

  const message = xml(
    "iq",
    {
      type: "get",
      from: walletAddress + "@" + DOMAIN,
      to: chat_jid,
      id: "iq1",
    },
    xml("profile", {
      xmlns: "urn:xmpp:tmp:profile",
    })
  )

  xmpp.send(message)
}

export const vcardRetrievalRequest = (walletAddress: string, xmpp: any) => {
  //     <iq from='stpeter@jabber.org/roundabout'
  //     id='v1'
  //     type='get'>
  //   <vCard xmlns='vcard-temp'/>
  // </iq>

  const message = xml(
    "iq",
    {
      from: walletAddress + "@" + DOMAIN,
      id: XMPP_TYPES.vCardRequest,
      type: "get",
    },
    xml("vCard", {
      xmlns: "vcard-temp",
    })
  )

  xmpp.send(message)
}

export const setRoomImage = (
  userJid: string,
  roomJid: string,
  roomThumbnail: string,
  roomBackground: string,
  type: string,
  xmpp: any
) => {
  const message = xml(
    "iq",
    {
      from: userJid,
      id:
        type === "icon"
          ? XMPP_TYPES.setRoomImage
          : XMPP_TYPES.setRoomBackgroundImage,
      type: "set",
    },
    xml("query", {
      xmlns: "ns:getrooms:setprofile",
      room_thumbnail: roomThumbnail,
      room_background: roomBackground,
      room: roomJid,
    })
  )
  xmpp.send(message)
}

//stanza to delete message.
export const deleteMessageStanza = (
  from: string,
  roomJid: string,
  messageId: string,
  xmpp: any
) => {
  const stanza = xml(
    "message",
    {
      from: from,
      to: roomJid,
      id: XMPP_TYPES.deleteMessage,
      type: "groupchat",
    },
    xml("body", ""),
    xml("delete", {
      id: messageId,
    })
  )

  xmpp.send(stanza)
}

export const updateVCard = (
  photoURL: string | null,
  desc: string | null,
  fullName: string | null,
  xmpp: any
) => {
  const message = xml(
    "iq",
    {
      id: XMPP_TYPES.updateVCard,
      type: "set",
    },
    xml(
      "vCard",
      {
        xmlns: "vcard-temp",
      },
      desc ? xml("DESC", {}, desc) : null,
      photoURL ? xml("URL", {}, photoURL) : null,
      fullName ? xml("FN", {}, fullName) : null
    )
  )
  xmpp.send(message)
}

export const retrieveOtherUserVcard = (
  username: string,
  userJID: string,
  xmpp: any
) => {
  const message = xml(
    "iq",
    {
      from: username + "@" + DOMAIN,
      id: XMPP_TYPES.otherUserVCardRequest,
      to: userJID + "@" + DOMAIN,
      type: "get",
    },
    xml("vCard", { xmlns: "vcard-temp" })
  )

  xmpp?.send(message)
}

export const createNewRoom = (from: string, to: string, xmpp: any) => {
  const message = xml(
    "presence",
    {
      id: XMPP_TYPES.createRoom,
      from: from + "@" + DOMAIN,
      to: to + CONFERENCEDOMAIN + "/" + from,
    },
    xml("x", "http://jabber.org/protocol/muc")
  )
  xmpp.send(message)
}

export const setOwner = (from: string, to: string, xmpp: any) => {
  const message = xml(
    "iq",
    {
      to: to + CONFERENCEDOMAIN,
      from: from + "@" + DOMAIN,
      id: XMPP_TYPES.setOwner,
      type: "set",
    },
    xml("query", { xmlns: "http://jabber.org/protocol/muc#owner" })
  )

  xmpp.send(message)
}

export const roomConfig = (
  from: string,
  to: string,
  data: { roomName: string; roomDescription: string },
  xmpp: any
) => {
  const message = xml(
    "iq",
    {
      from: from + "@" + DOMAIN,
      id: XMPP_TYPES.roomConfig,
      to: to + CONFERENCEDOMAIN,
      type: "set",
    },
    xml(
      "query",
      { xmlns: "http://jabber.org/protocol/muc#owner" },
      xml(
        "x",
        { xmlns: "jabber:x:data", type: "submit" },
        xml(
          "field",
          { var: "FORM_TYPE" },
          xml("value", {}, "http://jabber.org/protocol/muc#roomconfig")
        ),
        xml(
          "field",
          { var: "muc#roomconfig_roomname" },
          xml("value", {}, data.roomName)
        ),
        xml(
          "field",
          { var: "muc#roomconfig_roomdesc" },
          xml("value", {}, data.roomDescription)
        )
      )
    )
  )

  xmpp.send(message)
}

export const sendInvite = (
  from: string,
  to: string,
  otherUserId: string,
  xmpp: any
) => {
  const stanza = xml(
    "message",
    { from: from + "@" + DOMAIN, to: to },
    xml(
      "x",
      "http://jabber.org/protocol/muc#user",
      xml(
        "invite",
        { to: otherUserId + "@" + DOMAIN },
        xml("reason", {}, "Hey, this is the place with amazing cookies!")
      )
    )
  )

  xmpp.send(stanza)
}

export const banUser = (
  to: string,
  from: string,
  bannedUserWalletAddres: string,
  xmpp: any
) => {
  //   <iq from='kinghenryv@shakespeare.lit/throne'
  //     id='ban1'
  //     to=
  //     type='set'>
  //   <query xmlns='http://jabber.org/protocol/muc#admin'>
  //     <item affiliation='outcast'
  //           jid='earlofcambridge@shakespeare.lit'/>
  //   </query>
  // </iq>
  const message = xml(
    "iq",
    {
      id: "ban_user",
      to: to,
      from: from + "@" + DOMAIN,
      type: "set",
    },
    xml(
      "query",
      "http://jabber.org/protocol/muc#owner",
      xml("item", {
        affiliation: "outcast",
        jid: bannedUserWalletAddres + "@" + DOMAIN,
      })
    )
  )
  xmpp.send(message)
}

export const banUserr = (
  from: string,
  banUserId: string,
  roomJid: string,
  xmpp: any
) => {
  // <iq from="oleksiika@localhost" type="set" id="ban">
  //   <query
  //       xmlns="ns:deepx:muc:user:ban"
  //       action="ban"
  //       user="user@server"
  //       type="room" // Can be room or all
  //       room="name@conference.server"
  //       time="300" // Time of ban in seconds
  //       comment="Test ban" //Comment for ban
  //   />
  // </iq>

  const message = xml(
    "iq",
    {
      from: from + "@" + DOMAIN,
      type: "set",
      id: XMPP_TYPES.ban,
    },
    xml("query", {
      xmlns: "ns:deepx:muc:user:ban",
      action: "ban",
      user: banUserId,
      type: "room",
      room: roomJid,
      time: "2592000",
      comment: "Ban",
    })
  )

  xmpp.send(message)
}

export const unbanUser = (
  from: string,
  unbanUserId: string,
  roomJid: string,
  xmpp: any
) => {
  // <iq from="user@server" type="set" id="unban">
  // <query
  //     xmlns="ns:deepx:muc:user:ban"
  //     action="unban"
  //     user="user@server"
  //     type="room"
  //     room="name@conference.server"/>
  // </iq>

  const message = xml(
    "iq",
    {
      from: from + "@" + DOMAIN,
      type: "set",
      id: XMPP_TYPES.unBan,
    },
    xml("query", {
      xmlns: "ns:deepx:muc:user:ban",
      action: "unban",
      user: unbanUserId,
      type: "room",
      room: roomJid,
    })
  )

  xmpp.send(message)
}

export const getListOfBannedUserInRoom = (
  from: string,
  roomJId: string,
  xmpp: any
) => {
  const message = xml(
    "iq",
    {
      from: from + "@" + DOMAIN,
      type: "set",
      id: XMPP_TYPES.getBannedUserListOfRoom,
    },
    xml("query", {
      xmlns: "ns:deepx:muc:user:ban",
      action: "get_list",
      type: "room",
      room: roomJId,
    })
  )

  xmpp.send(message)
}

export const assignModerator = (from: string, to: string, xmpp: any) => {
  // <iq from='crone1@shakespeare.lit/desktop'
  //     id='mod1'
  //     to='coven@chat.shakespeare.lit'
  //     type='set'>
  //   <query xmlns='http://jabber.org/protocol/muc#admin'>
  //     <item nick='thirdwitch'
  //           role='moderator'/>
  //   </query>
  // </iq>

  const message = xml(
    "iq",
    {
      from: from + "@" + DOMAIN,
      id: XMPP_TYPES.assignModerator,
      to: to,
      type: "set",
    },
    xml(
      "query",
      {
        xmlns: "http://jabber.org/protocol/muc#admin",
      },
      xml("item", {
        nick: "Moderator",
        role: "moderator",
      })
    )
  )

  xmpp.send(message)
}

export const unAssignModerator = (from: string, to: string, xmpp: any) => {
  //   <iq from='crone1@shakespeare.lit/desktop'
  //     id='mod2'
  //     to='coven@chat.shakespeare.lit'
  //     type='set'>
  //   <query xmlns='http://jabber.org/protocol/muc#admin'>
  //     <item nick='thirdwitch'
  //           role='participant'/>
  //   </query>
  // </iq>

  const message = xml(
    "iq",
    {
      from: from + "@" + DOMAIN,
      id: XMPP_TYPES.unAssignModerator,
      to: to,
      type: "set",
    },
    xml(
      "query",
      {
        xmlns: "http://jabber.org/protocol/muc#admin",
      },
      xml("item", {
        nick: "Participant",
        role: "participant",
      })
    )
  )

  xmpp.send(message)
}

export const getRoomMemberInfo = (from: string, to: string, xmpp: any) => {
  //   <iq
  // from="oleksiika@localhost" type="get"
  // id="test2@conference.localhost"><query xmlns="ns:room:last"
  // room="test2@conference.localhost"/></iq>

  const message = xml(
    "iq",
    {
      from: from + "@" + DOMAIN,
      type: "get",
      id: XMPP_TYPES.roomMemberInfo,
    },
    xml("query", {
      xmlns: "ns:room:last",
      room: to,
    })
  )

  xmpp.send(message)
}

//stanza to change room description.
export const changeRoomDescription = (
  from: string,
  to: string,
  desc: string,
  xmpp: any
) => {
  const message = xml(
    "iq",
    {
      from: from + "@" + DOMAIN,
      id: XMPP_TYPES.changeRoomDescription,
      to: to,
      type: "set",
    },
    xml(
      "query",
      { xmlns: "http://jabber.org/protocol/muc#owner" },
      xml(
        "x",
        { xmlns: "jabber:x:data", type: "submit" },
        xml(
          "field",
          { var: "FORM_TYPE" },
          xml("value", {}, "http://jabber.org/protocol/muc#roomconfig")
        ),
        xml("field", { var: "muc#roomconfig_roomdesc" }, xml("value", {}, desc))
      )
    )
  )

  xmpp.send(message)
}
