import xmpp, { xml } from "@xmpp/client";
import { Client } from "@xmpp/client";
import { Element } from "ltx";
import { TMessageHistory, useStoreState } from "./store";
import { sendBrowserNotification } from "./utils";

let lastMsgId: string = "";
let temporaryMessages: TMessageHistory[] = [];
let isGettingMessages: boolean = false;
let isGettingFirstMessages: boolean = false;
let lastRomJIDLoading: string = "";

export function walletToUsername(str: string) {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

export function usernameToWallet(str: string) {
  str.replace(/_([a-z])/gm, (m1: string, m2: string) => {
    return m2.toUpperCase();
  });
}

const onMessage = async (stanza: Element) => {
  if (stanza.is("message") && stanza.attrs.id === "sendMessage") {
    const body = stanza.getChild("body");
    const data = stanza.getChild("data");
    if (!data || !body) {
      return;
    }

    if (!data.attrs.senderFirstName || !data.attrs.senderLastName) {
      return;
    }

    const msg = {
      body: body.getText(),
      firsName: data.attrs.senderFirstName,
      lastName: data.attrs.senderLastName,
      wallet: data.attrs.senderWalletAddress,
      from: stanza.attrs.from,
      room: stanza.attrs.from.toString().split("/")[0],
    };

    console.log("+++++ ", msg);

    useStoreState.getState().setNewMessage(msg);
  }
};

const onMessageHistory = async (stanza: Element) => {
  if (stanza.is("message")) {
    const body = stanza
      .getChild("result")
      ?.getChild("forwarded")
      ?.getChild("message")
      ?.getChild("body");
    const data = stanza
      .getChild("result")
      ?.getChild("forwarded")
      ?.getChild("message")
      ?.getChild("data");
    const delay = stanza
      .getChild("result")
      ?.getChild("forwarded")
      ?.getChild("delay");
    const id = stanza.getChild("result")?.attrs.id;

    if (!data || !body || !delay || !id) {
      return;
    }

    if (
      !data.attrs.senderFirstName ||
      !data.attrs.senderLastName ||
      !data.attrs.senderJID
    ) {
      return;
    }
    const msg = {
      id: Number(id),
      body: body.getText(),
      data: {
        isSystemMessage: data.attrs.isSystemMessage,
        photoURL: data.attrs.photoURL,
        quickReplies: data.attrs.quickReplies,
        roomJid: data.attrs.roomJid,
        senderFirstName: data.attrs.senderFirstName,
        senderJID: data.attrs.senderJID,
        senderLastName: data.attrs.senderLastName,
        senderWalletAddress: data.attrs.senderWalletAddress,
        tokenAmount: data.attrs.tokenAmount,
        isMediafile: data.attrs?.isMediafile,
        originalName: data.attrs?.originalName,
        location: data.attrs?.location,
        locationPreview: data.attrs?.locationPreview,
        mimetype: data.attrs?.mimetype,
        xmlns: data.attrs.xmlns,
      },
      roomJID: stanza.attrs.from,
      date: delay.attrs.stamp,
      key: Date.now() + Number(id),
    };

    // console.log('TEST ', data.attrs)
    if (isGettingMessages) {
      temporaryMessages.push(msg);
    }
    if (!isGettingMessages) {
      useStoreState.getState().setNewMessageHistory(msg);
      useStoreState.getState().sortMessageHistory();
    }

    const untrackedRoom = useStoreState.getState().currentUntrackedChatRoom;
    if (
      stanza.attrs.to.split("@")[0] !== data.attrs.senderJID.split("@")[0] &&
      stanza.attrs.from.split("@")[0] !== untrackedRoom.split("@")[0] &&
      !isGettingFirstMessages
    ) {
      useStoreState.getState().updateCounterChatRoom(data.attrs.roomJid);
      sendBrowserNotification(msg.body, () => {});
    }
  }
};

const onLastMessageArchive = (stanza: Element, xmpp: any) => {
  if (
    stanza.attrs.id === "paginatedArchive" ||
    stanza.attrs.id === "GetArchive"
  ) {
    lastMsgId = String(
      stanza.getChild("fin")?.getChild("set")?.getChild("last")?.children[0]
    );
    if (isGettingMessages) {
      useStoreState.getState().updateMessageHistory(temporaryMessages);
      isGettingMessages = false;
      useStoreState.getState().setLoaderArchive(false);
      temporaryMessages = [];
      isGettingFirstMessages = false;
    }

    if (lastRomJIDLoading && lastRomJIDLoading === stanza.attrs.from) {
      useStoreState.getState().setLoaderArchive(false);
      lastRomJIDLoading = "";
      isGettingFirstMessages = false;
    }
  }
};

const onGetLastMessageArchive = (stanza: Element, xmpp: any) => {
  if (stanza.attrs.id === "sendMessage") {
    const data = stanza.getChild("stanza-id");
    if (data) {
      xmpp.getLastMessageArchive(data.attrs.by);
      return;
    }
    return onMessage(stanza);
  }
};

const connectToUserRooms = (stanza: Element, xmpp: any) => {
  if (stanza.attrs.id === "getUserRooms") {
    if (stanza.getChild("query")?.children) {
      isGettingFirstMessages = true;
      useStoreState.getState().clearUserChatRooms();
      useStoreState.getState().setLoaderArchive(true);
      let roomJID: string = "";
      const currentChatRooms = useStoreState.getState().userChatRooms;

      console.log("ROOMS ", stanza.getChild("query")?.children);
      stanza.getChild("query")?.children.forEach((result: any) => {
        if (
          result?.attrs.name &&
          currentChatRooms.filter((el) => el.jid === result?.attrs.jid)
            .length === 0
        ) {
          roomJID = result.attrs.jid;
          xmpp.presenceInRoom(roomJID);

          const roomData = {
            jid: roomJID,
            name: result?.attrs.name,
            room_background: result?.attrs.room_background,
            room_thumbnail: result?.attrs.room_thumbnail,
            users_cnt: result?.attrs.users_cnt,
            unreadMessages: 0,
            composing: "",
          };
          useStoreState.getState().setNewUserChatRoom(roomData);

          //get message history in the room
          xmpp.getRoomArchiveStanza(roomJID, 1);
        }
        lastRomJIDLoading = roomJID;
      });
    }
  }
};

const onComposing = (stanza: Element) => {
  if (
    stanza.attrs.id === "isComposing" ||
    stanza.attrs.id === "pausedComposing"
  ) {
    const requestType = stanza.attrs.id;
    const recipientID = String(stanza.attrs.to).split("@")[0];
    const senderID = stanza.getChild("data").attrs.manipulatedWalletAddress;

    if (recipientID === walletToUsername(senderID)) {
      return;
    }

    if (requestType === "isComposing") {
      useStoreState
        .getState()
        .updateComposingChatRoom(
          stanza.attrs.from.toString().split("/")[0],
          true,
          stanza.getChild("data").attrs.fullName
        );

      setTimeout(
        () =>
          useStoreState
            .getState()
            .updateComposingChatRoom(
              stanza.attrs.from.toString().split("/")[0],
              false
            ),
        1500
      );
    }

    if (stanza.attrs.id === "pausedComposing") {
      useStoreState
        .getState()
        .updateComposingChatRoom(
          stanza.attrs.from.toString().split("/")[0],
          false
        );
    }
  }
};

const getListOfRooms = (xmpp: any) => {
  xmpp.client.send(xml("presence"));
  xmpp.getArchive(xmpp.client?.jid?.toString());
  defaultRooms.map((roomJID) => {
    xmpp.presenceInRoom(roomJID);
  });
  xmpp.getRooms();
  useStoreState.getState().clearMessageHistory();
};

const onInvite = (stanza: Element, xmpp: any) => {
  if (stanza.is("message")) {
    const isArchiveInvite = stanza
      .getChild("result")
      ?.getChild("forwarded")
      ?.getChild("message")
      ?.getChild("x")
      ?.getChild("invite");
    if (stanza.getChild("x")?.getChild("invite") || isArchiveInvite) {
      let jid = stanza.attrs.from;
      if (isArchiveInvite) {
        jid = stanza
          .getChild("result")
          ?.getChild("forwarded")
          ?.getChild("message").attrs.from;
      }
      xmpp.subsribe(jid);
      xmpp.presenceInRoom(jid);
      xmpp.getRooms();
    } else {
    }
  } else {
  }
};

const defaultRooms = [
  "1c525d51b2a0e9d91819933295fcd82ba670371b92c0bf45ba1ba7fb904dbcdc@conference.dev.dxmpp.com",
  "d0df15e359b5d49aaa965bca475155b81784d9e4c5f242cebe405ae0f0046a22@conference.dev.dxmpp.com",
  "fd6488675183a9db2005879a945bf5727c8594eaae5cdbd35cb0b02c5751760e@conference.dev.dxmpp.com",
];

class XmppClass {
  public client!: Client;

  init(walletAddress: string, password: string) {
    if (!password) {
      return;
    }

    if (this.client) {
      return;
    }

    this.client = xmpp.client({
      service: "wss://dev.dxmpp.com:5443/ws",
      username: walletToUsername(walletAddress),
      password,
    });

    this.client.start();

    this.client.on("online", (jid) => getListOfRooms(this));

    this.client.on("stanza", onMessageHistory);
    this.client.on("stanza", (stanza) => onGetLastMessageArchive(stanza, this));
    this.client.on("stanza", (stanza) => connectToUserRooms(stanza, this));
    this.client.on("stanza", (stanza) => onLastMessageArchive(stanza, this));
    this.client.on("stanza", (stanza) => onComposing(stanza));
    this.client.on("stanza", (stanza) => onInvite(stanza, this));
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
    console.log(username + "@" + this.client.jid?.getDomain());
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
  presenceInRoom(room: string) {
    const presence = xml(
      "presence",
      {
        from: this.client.jid?.toString(),
        to: room + "/" + this.client.jid?.getLocal(),
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
    if (lastMsgId === firstUserMessageID) {
      return;
    }
    isGettingMessages = true;
    isGettingFirstMessages = true;
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
    isGettingMessages = true;
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
        xmlns: "wss://dev.dxmpp.com:5443/ws",
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

  sendSystemMessage(
    roomJID: string,
    firstName: string,
    lastName: string,
    walletAddress: string,
    userMessage: string,
    amount: number,
    receiverMessageId: number
  ) {
    const message = xml(
      "message",
      {
        to: roomJID,
        type: "groupchat",
        id: "sendMessage",
      },
      xml("data", {
        xmlns: "wss://dev.dxmpp.com:5443/ws",
        senderFirstName: firstName,
        senderLastName: lastName,
        senderJID: this.client.jid?.toString(),
        senderWalletAddress: walletAddress,
        roomJid: roomJID,
        isSystemMessage: true,
        tokenAmount: amount,
        receiverMessageId: receiverMessageId,
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
        xmlns: "wss://dev.dxmpp.com:5443/ws",
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
        mainMessageText: data?.mainMessageText,
        mainMessageId: data?.mainMessageId,
        mainMessageUserName: data?.mainMessageUserName,
        mainMessageCreatedAt: data?.mainMessageCreatedAt,
        mainMessageFileName: data?.mainMessageFileName,
        mainMessageImageLocation: data?.mainMessageImageLocation,
        mainMessageImagePreview: data?.mainMessageImagePreview,
        mainMessageMimeType: data?.mainMessageMimeType,
        mainMessageOriginalName: data?.mainMessageOriginalName,
        mainMessageSize: data?.mainMessageSize,
        mainMessageDuration: data?.mainMessageDuration,
        mainMessageWaveForm: data?.mainMessageWaveForm,
        mainMessageAttachmentId: data?.mainMessageAttachmentId,
        mainMessageWrappable: data?.mainMessageWrappable,
        mainMessageNftId: data?.mainMessageNftId,
        mainMessageNftActionType: data?.mainMessageNftActionType,
        mainMessageContractAddress: data?.mainMessageContractAddress,
        mainMessageRoomJid: data?.mainMessageRoomJid,
        showInChannel: data?.showInChannel,
      })
    );

    this.client.send(message);
  }

  createNewRoom(to: string) {
    const message = xml(
      "presence",
      {
        id: "createRoom",
        from: this.client.jid?.toString(),
        to:
          to +
          "@conference.dev.dxmpp.com" +
          "/" +
          this.client.jid?.toString().split("@")[0],
      },
      xml("x", "http://jabber.org/protocol/muc")
    );
    console.log(
      "CREATE ",
      to +
        "@conference.dev.dxmpp.com" +
        "/" +
        this.client.jid?.toString().split("@")[0]
    );
    this.client.send(message);
  }

  roomConfig(to: string, data: { roomName: string; roomDescription?: string }) {
    const message = xml(
      "iq",
      {
        from: this.client.jid?.toString(),
        id: "roomConfig",
        to: to + "@conference.dev.dxmpp.com",
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
          { to: otherUserId },
          xml("reason", {}, "Hey, this is the place with amazing cookies!")
        )
      )
    );
    this.client.send(stanza);
  }

  setOwner(to) {
    const message = xml(
      "iq",
      {
        to: to + "@conference.dev.dxmpp.com",
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
        xmlns: "wss://dev.dxmpp.com:5443/ws",
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
        xmlns: "wss://dev.dxmpp.com:5443/ws",
        manipulatedWalletAddress: walletAddress,
      })
    );
    this.client.send(message);
  };
}

export default new XmppClass();
