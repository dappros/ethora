import xmpp, { xml } from "@xmpp/client";
import { Client } from "@xmpp/client";
import { CONFERENCEDOMAIN, DOMAIN, SERVICE } from "./constants";
import { useStoreState } from "./store";
import { walletToUsername } from "./utils/walletManipulation";
import { XmppHandler } from "./xmppHandler";
import { defaultChats } from "./config/config";

const xmppMessagesHandler = new XmppHandler();

export class XmppClass {
  public client!: Client;

  init(walletAddress: string, password: string) {
    if (!password) {
      return;
    }

    if (this.client) {
      return;
    }

    this.client = xmpp.client({
      service: SERVICE,
      username: walletToUsername(walletAddress),
      password,
    });

    this.client.start();

    this.client.on("online", (jid) => {
      xmppMessagesHandler.getListOfRooms(this)
      this.subscribeToDefaultChats()
    });
    this.client.on("stanza", xmppMessagesHandler.onMessageHistory);
    this.client.on("stanza", (stanza) =>
      xmppMessagesHandler.onRealtimeMessage(stanza)
    );
    this.client.on("stanza", (stanza) =>
      xmppMessagesHandler.onGetLastMessageArchive(stanza, this)
    );
    this.client.on("stanza", (stanza) =>
      xmppMessagesHandler.connectToUserRooms(stanza, this)
    );
    this.client.on("stanza", (stanza) =>
      xmppMessagesHandler.onLastMessageArchive(stanza, this)
    );
    this.client.on("stanza", (stanza) =>
      xmppMessagesHandler.onComposing(stanza)
    );
    this.client.on("stanza", (stanza) =>
      xmppMessagesHandler.onInvite(stanza, this)
    );
    this.client.on("stanza", (stanza) =>
      xmppMessagesHandler.onBlackList(stanza, this)
    );
    this.client.on("stanza", (stanza) =>
      xmppMessagesHandler.onGetRoomInfo(stanza)
    );
    this.client.on("stanza", (stanza) =>
      xmppMessagesHandler.onGetRoomMemberInfo(stanza)
    );
    this.client.on("stanza", (stanza) =>
      xmppMessagesHandler.onChangeDescription(stanza, this)
    );
    this.client.on("stanza", (stanza) =>
      xmppMessagesHandler.onChangeRoomName(stanza, this)
    );
    this.client.on("stanza", (stanza) =>
      xmppMessagesHandler.onPresenceInRoom(stanza)
    );
    this.client.on("stanza", (stanza) => xmppMessagesHandler.onBan(stanza));
    this.client.on("stanza", (stanza) =>
      xmppMessagesHandler.onRemoveFromBlackList(stanza, this)
    );
    this.client.on("stanza", (stanza) => xmppMessagesHandler.onBan(stanza));
    this.client.on("stanza", (stanza) =>
      xmppMessagesHandler.onNewSubscription(stanza, this)
    );
    this.client.on("stanza", (stanza) =>
      xmppMessagesHandler.onRoomDesignChange(stanza, this)
    );
    this.client.on("stanza", (stanza) =>
      xmppMessagesHandler.onSendReplaceMessageStanza(stanza)
    );
    this.client.on("stanza", (stanza) =>
      xmppMessagesHandler.onDeleteMessageStanza(stanza)
    );

    this.client.on("offline", () => console.log("offline"));
    this.client.on("error", (error) => {
      console.log("xmmpp on error ", error);
      this.stop();
      console.log("xmmpp error, terminating collection");
    });
  }

  stop() {
    if (this.client) {
      this.client.stop();
      return;
    }
  }
  setRoomImage = (
    roomAddress: string,
    roomThumbnail: string,
    roomBackground: string,
    type: string
  ) => {
    const message = xml(
      "iq",
      {
        from: this.client.jid?.toString(),
        id: type === "icon" ? "setRoomImage" : "setRoomBackground",
        type: "set",
      },
      xml("query", {
        xmlns: "ns:getrooms:setprofile",
        room_thumbnail: roomThumbnail,
        room_background: roomBackground,
        room: roomAddress + CONFERENCEDOMAIN,
      })
    );
    this.client.send(message);
  };
  subscribeToDefaultChats = () => {
    Object.entries(defaultChats).forEach(([key]) => {
      const jid = key + CONFERENCEDOMAIN;
      
      this.subsribe(jid);
    });
  };
  subsribe(address: string) {
    const message = xml(
      "iq",
      {
        from: this.client?.jid?.toString(),
        to: address,
        type: "set",
        id: "newSubscription",
      },
      xml(
        "subscribe",
        { xmlns: "urn:xmpp:mucsub:0", nick: this.client?.jid?.getLocal() },
        xml("event", { node: "urn:xmpp:mucsub:nodes:messages" }),
        xml("event", { node: "urn:xmpp:mucsub:nodes:presence" }),
        xml("event", { node: "urn:xmpp:mucsub:nodes:subscribers" }),
        xml("event", { node: "urn:xmpp:mucsub:nodes:subject" })
      )
    );

    this.client.send(message);
  }

  discoInfo() {
    const message = xml(
      "iq",
      {
        from: this.client?.jid?.toString(),
        to: this.client?.jid?.getDomain(),
        type: "get",
        id: "discover",
      },
      xml("query", { xmlns: "http://jabber.org/protocol/disco#info" })
    );

    this.client.send(message);
  }

  unsubscribe(address: string) {
    const message = xml(
      "iq",
      {
        from: this.client?.jid?.toString(),
        to: address,
        type: "set",
        id: "unsubscribe",
      },
      xml("unsubscribe", { xmlns: "urn:xmpp:mucsub:0" })
    );

    this.client.send(message);
  }

  getRooms() {
    const message = xml(
      "iq",
      {
        type: "get",
        from: this.client.jid?.toString(),
        id: "getUserRooms",
      },
      xml("query", { xmlns: "ns:getrooms" })
    );
    this.client.send(message);
  }

  getVcard(username: string) {
    if (username !== this.client.jid?.getLocal()) {
      // get other vcard
      const message = xml(
        "iq",
        {
          from: this.client.jid?.toString(),
          id: "vCardOther",
          to: username + "@" + this.client.jid?.getDomain(),
          type: "get",
        },
        xml("vCard", { xmlns: "vcard-temp" })
      );

      this.client.send(message);
    } else {
      const message = xml(
        "iq",
        {
          from: username + "@" + this.client.jid?.getDomain(),
          id: "vCardMy",
          type: "get",
        },
        xml("vCard", {
          xmlns: "vcard-temp",
        })
      );
      this.client.send(message);
    }
  }

  presence() {
    this.client.send(xml("presence"));
  }

  botPresence(room: string) {
    const xmlMsg = xml(
      "presence",
      {
        from: this.client.jid?.toString(),
        to: `${room}/${this.client.jid?.getLocal()}`,
      },
      xml("x", "http://jabber.org/protocol/muc")
    );
    this.client.send(xmlMsg);
  }

  roomPresence(room: string) {
    const presence = xml(
      "presence",
      {
        from: this.client.jid?.toString(),
        to: `${room}/${this.client.jid?.getLocal()}`,
      },
      xml("x", "http://jabber.org/protocol/muc")
    );
    this.client.send(presence);
  }

  leaveTheRoom(room: string) {
    const presence = xml("presence", {
      from: this.client.jid?.toString(),
      to: room + "/" + this.client.jid?.getLocal(),
      type: "unavailable",
    });
    this.client.send(presence);
  }
  presenceInRoom(room: string) {
    const presence = xml(
      "presence",
      {
        from: this.client.jid?.toString(),
        to: room + "/" + this.client.jid?.getLocal(),
        id: "presenceInRoom",
      },
      xml("x", "http://jabber.org/protocol/muc")
    );
    this.client.send(presence);
  }

  getRoomArchiveStanza(chatJID: string, amount: number) {
    let message = xml(
      "iq",
      {
        type: "set",
        to: chatJID,
        id: "GetArchive",
      },
      xml(
        "query",
        { xmlns: "urn:xmpp:mam:2" },
        xml(
          "set",
          { xmlns: "http://jabber.org/protocol/rsm" },
          xml("max", {}, String(amount)),
          xml("before")
        )
      )
    );
    this.client.send(message);
  }

  getPaginatedArchive = (
    chatJID: string,
    firstUserMessageID: string,
    amount: number
  ) => {
    if (xmppMessagesHandler.lastMsgId === firstUserMessageID) {
      return;
    }
    xmppMessagesHandler.isGettingMessages = true;
    xmppMessagesHandler.isGettingFirstMessages = true;
    useStoreState.getState().setLoaderArchive(true);
    const message = xml(
      "iq",
      {
        type: "set",
        to: chatJID,
        id: "paginatedArchive",
      },
      xml(
        "query",
        { xmlns: "urn:xmpp:mam:2" },
        xml(
          "set",
          { xmlns: "http://jabber.org/protocol/rsm" },
          xml("max", {}, String(amount)),
          xml("before", {}, firstUserMessageID)
        )
      )
    );
    this.client.send(message);
  };

  getLastMessageArchive(chat_jid: string) {
    xmppMessagesHandler.isGettingMessages = true;
    let message = xml(
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
          xml("max", {}, "1"),
          xml("before")
        )
      )
    );
    this.client.send(message);
  }

  sendMessage(
    roomJID: string,
    firstName: string,
    lastName: string,
    photo: string,
    walletAddress: string,
    userMessage: string,
    notDisplayedValue?: string
  ) {
    const message = xml(
      "message",
      {
        to: roomJID,
        type: "groupchat",
        id: "sendMessage",
      },
      xml("data", {
        xmlns: SERVICE,
        senderFirstName: firstName,
        senderLastName: lastName,
        photoURL: photo,
        senderJID: this.client.jid?.toString(),
        senderWalletAddress: walletAddress,
        roomJid: roomJID,
        isSystemMessage: false,
        tokenAmount: 0,
        quickReplies: [],
        notDisplayedValue: notDisplayedValue ? notDisplayedValue : "",
      }),
      xml("body", {}, userMessage)
    );
    this.client.send(message);
  }
  sendMessageStanza = (roomJID: string, messageText: string, data: any) => {
    const message = xml(
      "message",
      {
        id: "sendMessage",
        type: "groupchat",
        from: this.client.jid?.toString(),
        to: roomJID,
      },
      xml("body", {}, messageText),
      xml("data", {
        xmlns: SERVICE,

        senderJID: this.client.jid?.toString(),
        ...data,
      })
    );
    this.client.send(message);
  };

  sendSystemMessage(
    roomJID: string,
    firstName: string,
    lastName: string,
    walletAddress: string,
    userMessage: string,
    amount: number,
    receiverMessageId: number,
    transactionId: string
  ) {
    const message = xml(
      "message",
      {
        to: roomJID,
        type: "groupchat",
        id: "sendMessage",
      },
      xml("data", {
        xmlns: SERVICE,
        senderFirstName: firstName,
        senderLastName: lastName,
        senderJID: this.client.jid?.toString(),
        senderWalletAddress: walletAddress,
        roomJid: roomJID,
        isSystemMessage: true,
        tokenAmount: amount,
        receiverMessageId: receiverMessageId,
        transactionId,
      }),
      xml("body", {}, userMessage)
    );
    this.client.send(message);
  }

  sendMediaMessageStanza(roomJID: string, data: any) {
    const message = xml(
      "message",
      {
        id: "sendMessage",
        type: "groupchat",
        from: this.client.jid?.toString(),
        to: roomJID,
      },
      xml("body", {}, "media"),
      xml("store", { xmlns: "urn:xmpp:hints" }),
      xml("data", {
        xmlns: SERVICE,
        senderJID: this.client.jid?.toString(),
        senderFirstName: data.firstName,
        senderLastName: data.lastName,
        senderWalletAddress: data.walletAddress,
        isSystemMessage: false,
        tokenAmount: "0",
        receiverMessageId: "0",
        mucname: data.chatName,
        photoURL: data.userAvatar ? data.userAvatar : "",
        isMediafile: true,
        createdAt: data.createdAt,
        expiresAt: data.expiresAt,
        fileName: data.fileName,
        isVisible: data.isVisible,
        location: data.location,
        locationPreview: data.locationPreview,
        mimetype: data.mimetype,
        originalName: data.originalName,
        ownerKey: data.ownerKey,
        size: data.size,
        duration: data?.duration,
        updatedAt: data.updatedAt,
        userId: data.userId,
        waveForm: data.waveForm,
        attachmentId: data?.attachmentId,
        wrappable: data?.wrappable,
        nftId: data?.nftId,
        isReply: data?.isReply,
        mainMessage: data?.mainMessage,
        roomJid: data?.roomJid,
      })
    );

    this.client.send(message);
  }

  createNewRoom(to: string) {
    let message = xml(
      "presence",
      {
        id: "createRoom",
        from: this.client.jid?.toString(),

        to:
          to +
          CONFERENCEDOMAIN +
          "/" +
          this.client.jid?.toString().split("@")[0],
      },
      xml("x", "http://jabber.org/protocol/muc")
    );
    // console.log(message.toString());
    this.client.send(message);
  }

  roomConfig(to: string, data: { roomName: string; roomDescription?: string }) {
    const message = xml(
      "iq",
      {
        from: this.client.jid?.toString(),
        id: "roomConfig",
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
    );

    this.client.send(message);
  }

  getArchive = (userJID: string) => {
    let message = xml(
      "iq",
      { type: "set", id: userJID },
      xml(
        "query",
        { xmlns: "urn:xmpp:mam:2", queryid: "userArchive" },
        xml("set", { xmlns: "http://jabber.org/protocol/rsm" }, xml("before"))
      )
    );
    this.client.send(message);
  };

  sendInvite(from: string, to: string, otherUserId: string) {
    const stanza = xml(
      "message",
      {
        from: this.client.jid?.toString().split("/")[0],
        to: to,
      },
      xml(
        "x",
        "http://jabber.org/protocol/muc#user",
        xml(
          "invite",
          { to: otherUserId + DOMAIN },
          xml("reason", {}, "Hey, this is the place with amazing cookies!")
        )
      )
    );
    this.client.send(stanza);
  }

  setOwner(to: string) {
    const message = xml(
      "iq",
      {
        to: to + CONFERENCEDOMAIN,
        from: this.client.jid?.toString(),
        id: "setOwner",
        type: "get",
      },
      xml("query", { xmlns: "http://jabber.org/protocol/muc#owner" })
    );

    this.client.send(message);
  }

  getRoomInfo = (roomJID: string) => {
    const message = xml(
      "iq",
      {
        from: this.client.jid?.toString(),
        id: "roomInfo",
        to: roomJID,
        type: "get",
      },
      xml("query", { xmlns: "http://jabber.org/protocol/disco#info" })
    );
    this.client.send(message);
  };

  isComposing = (walletAddress: string, chatJID: string, fullName: string) => {
    const message = xml(
      "message",
      {
        from: this.client.jid?.toString(),
        to: chatJID,
        id: "isComposing",
        type: "groupchat",
      },
      xml("composing", {
        xmlns: "http://jabber.org/protocol/chatstates",
      }),
      xml("data", {
        xmlns: SERVICE,
        fullName: fullName,
        manipulatedWalletAddress: walletAddress,
      })
    );
    this.client.send(message);
  };

  pausedComposing = (walletAddress: string, chatJID: string) => {
    const message = xml(
      "message",
      {
        from: this.client.jid?.toString(),
        to: chatJID,
        id: "pausedComposing",
        type: "groupchat",
      },
      xml("paused", {
        xmlns: "http://jabber.org/protocol/chatstates",
      }),
      xml("data", {
        xmlns: SERVICE,
        manipulatedWalletAddress: walletAddress,
      })
    );
    this.client.send(message);
  };

  blacklistUser = (userJIDToBlacklist: string) => {
    const stanza = xml(
      "iq",
      {
        from: this.client.jid?.toString(),

        type: "set",
        id: "addToBlackList",
      },
      xml("query", {
        xmlns: "ns:deepx:muc:user:block",
        user: userJIDToBlacklist,
      })
    );
    this.client.send(stanza);
  };
  getBlackList = () => {
    const stanza = xml(
      "iq",
      {
        from: this.client.jid?.toString(),
        type: "get",
        id: "blackList",
      },
      xml("query", {
        xmlns: "ns:deepx:muc:user:blocklist",
      })
    );
    this.client.send(stanza);
  };

  getRoomMemberInfo = (roomJID) => {
    const stanza = xml(
      "iq",
      {
        from: this.client.jid?.toString(),
        type: "get",
        id: "roomMemberInfo",
      },
      xml("query", {
        xmlns: "ns:room:last",
        room: roomJID,
      })
    );
    this.client.send(stanza);
  };

  changeRoomDescription = (roomJID: string, newDescription: string) => {
    const stanza = xml(
      "iq",
      {
        from: this.client.jid?.toString(),
        id: "changeRoomDescription",
        to: roomJID,
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
            { var: "muc#roomconfig_roomdesc" },
            xml("value", {}, newDescription)
          )
        )
      )
    );

    this.client.send(stanza);
  };

  changeRoomName = (roomJID: string, newRoomName: string) => {
    console.log(roomJID, newRoomName);
    const stanza = xml(
      "iq",
      {
        from: this.client.jid?.toString(),
        id: "changeRoomName",
        to: roomJID,
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
            xml("value", {}, newRoomName)
          )
        )
      )
    );

    this.client.send(stanza);
  };

  banUserStanza = (banUserId: string, roomJID: string) => {
    const stanza = xml(
      "iq",
      {
        from: this.client.jid?.toString(),
        type: "set",
        id: "ban",
      },
      xml("query", {
        xmlns: "ns:deepx:muc:user:ban",
        action: "ban",
        user: banUserId,
        type: "room",
        room: roomJID,
        time: "2592000",
        comment: "Ban",
      })
    );

    this.client.send(stanza);
  };

  unbanUserStanza = (unbanUserId: string, roomJID: string) => {
    const stanza = xml(
      "iq",
      {
        from: this.client.jid?.toString(),
        type: "set",
        id: "unBan",
      },
      xml("query", {
        xmlns: "ns:deepx:muc:user:ban",
        action: "unban",
        user: unbanUserId,
        type: "room",
        room: roomJID,
      })
    );

    this.client.send(stanza);
  };

  removeUserFromBlackList = (userAddressToRemoveFromBlacklist: string) => {
    const stanza = xml(
      "iq",
      {
        from: this.client.jid?.toString(),
        type: "set",
        id: "removeFromBlackList",
      },
      xml("query", {
        xmlns: "ns:deepx:muc:user:unblock",
        user: userAddressToRemoveFromBlacklist,
      })
    );

    this.client.send(stanza);
  };

  //stanza to edit/replace message.
  sendReplaceMessageStanza = (
    roomJID: string,
    replaceText: string,
    messageId: string,
    data: any
  ) => {
    const stanza = xml(
      "message",
      {
        from: this.client.jid?.toString(),
        id: "replaceMessage",
        type: "groupchat",
        to: roomJID,
      },
      xml("body", {}, replaceText),
      xml("replace", {
        id: messageId,
        xmlns: "urn:xmpp:message-correct:0",
      }),
      xml("data", {
        xmlns: "http://dev.dxmpp.com",
        senderJID: this.client.jid?.toString(),
        ...data,
      })
    );
    this.client.send(stanza);
  };

  //stanza to delete message
  deleteMessageStanza = (roomJid: string, messageId: string) => {
    // <message
    //   from="olek@localhost"
    //   id="1635229272917013"
    //   to="test_olek@conference.localhost"
    //   type="groupchat">
    //   <body>Wow</body>
    //   <delete id="1635229272917013" />
    // </message>;

    const stanza = xml(
      "message",
      {
        from: this.client.jid?.toString(),
        to: roomJid,
        id: "deleteMessageStanza",
        type: "groupchat",
      },
      xml("body", "wow"),
      xml("delete", {
        id: messageId,
      })
    );

    this.client.send(stanza);
  };
}

export default new XmppClass();
