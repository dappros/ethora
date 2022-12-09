import xmpp, { xml } from "@xmpp/client";
import { Client } from "@xmpp/client";
import { Element } from "ltx";
import { TMessageHistory, TRoomRoles, useStoreState } from "./store";
import { sendBrowserNotification } from "./utils";
import { history } from "./utils/history";

let lastMsgId: string = "";
let temporaryMessages: TMessageHistory[] = [];
let isGettingMessages: boolean = false;
let isGettingFirstMessages: boolean = false;
let lastRomJIDLoading: string = "";

export function walletToUsername(str: string) {
  if(str){
    return str.replace(/([A-Z])/g, "_$1").toLowerCase();
  }
  return "";
}

export function usernameToWallet(str: string) {
  return str.replace(/_([a-z])/gm, (m1: string, m2: string) => {
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
        receiverMessageId: data.attrs?.receiverMessageId,
        senderFirstName: data.attrs.senderFirstName,
        senderJID: data.attrs.senderJID,
        senderLastName: data.attrs.senderLastName,
        senderWalletAddress: data.attrs.senderWalletAddress,
        tokenAmount: Number(data.attrs.tokenAmount),
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
      coinsInMessage: 0
    };

    // console.log('TEST ', data.attrs)
    const blackList = useStoreState.getState().blackList.find(item => item.user === msg.data.senderJID);

    if (isGettingMessages && !blackList) {
      temporaryMessages.push(msg);
    }
    if (!isGettingMessages && !blackList) {
      useStoreState.getState().setNewMessageHistory(msg);
      useStoreState.getState().sortMessageHistory();
    }

    const untrackedRoom = useStoreState.getState().currentUntrackedChatRoom;
    if (
      stanza.attrs.to.split("@")[0] !== data.attrs.senderJID.split("@")[0] &&
      stanza.attrs.from.split("@")[0] !== untrackedRoom.split("@")[0] &&
      !isGettingFirstMessages &&
      data.attrs.roomJid
    ) {
      useStoreState.getState().updateCounterChatRoom(data.attrs.roomJid);
      sendBrowserNotification(msg.body, () => {
        history.push("/chat/" + msg.roomJID.split("@")[0]);
      });
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

      temporaryMessages.forEach((item) => {
        if(item.data.isSystemMessage && item.data.tokenAmount > 0){
          useStoreState.getState().updateCoinsInMessageHistory(
              Number(item.data.receiverMessageId),
              String(item.data.senderJID),
              Number(item.data.tokenAmount)
          );
        }
      })

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
    return onMessageHistory(stanza);
  }
};

const onGetRoomInfo = (stanza: Element|any) => {
  const userChatRooms = useStoreState.getState().userChatRooms;
  const currentRoomData = userChatRooms.filter((e) => e.jid === stanza.attrs.from)[0];
  if(stanza.attrs.id === 'roomInfo'){
    const featureList = stanza.children[0].children.find(
      item => item.attrs.xmlns === 'jabber:x:data',
    );
    const roomDescription = featureList.children.find(
      item => item.attrs.var === 'muc#roominfo_description',
    ).children[0]?.children[0]
    console.log(roomDescription)
    const roomData = {
      jid: currentRoomData.jid,
      name: currentRoomData.name,
      room_background: currentRoomData.room_background,
      room_thumbnail: currentRoomData.room_thumbnail,
      users_cnt: currentRoomData.users_cnt,
      unreadMessages: currentRoomData.unreadMessages,
      composing: currentRoomData.composing,
      toUpdate: currentRoomData.toUpdate,
      description: roomDescription
    };
    useStoreState.getState().updateUserChatRoom(roomData);
  }
}

const onGetRoomMemberInfo = (stanza: Element|any) => {
  if(stanza.attrs.id === 'roomMemberInfo'){
    if (stanza.children.length) {
      const info = stanza.children[0].children.map(
        item => item.attrs,
      )
      useStoreState.getState().setRoomMemberInfo(info);
    }
  }
}

const onChangeDescription = (stanza: Element, xmpp:any) => {
  if(stanza.attrs.id === "changeRoomDescription"){
    // console.log(stanza)
    xmpp.getRoomInfo(stanza.attrs.from);
  }
}

const onPresenceInRoom = (stanza: Element | any) => {
  if(stanza.attrs.id === 'presenceInRoom'){
    const roomJID:string = stanza.attrs.from.split('/')[0];
    const role:string = stanza.children[1].children[0].attrs.role;
    const elementObject:TRoomRoles = {roomJID:roomJID, role:role}
    useStoreState.getState().setRoomRoles(elementObject);
  }
}

const connectToUserRooms = (stanza: Element, xmpp: any) => {
  
  if (stanza.attrs.id === "getUserRooms") {
    if (stanza.getChild("query")?.children) {
      isGettingFirstMessages = true;
      useStoreState.getState().setLoaderArchive(true);
      let roomJID: string = "";
      stanza.getChild("query")?.children.forEach((result: any) => {
        const currentChatRooms = useStoreState.getState().userChatRooms;

        if (result?.attrs.name) {
          const currentSavedChatRoom = currentChatRooms.filter((el) => el.jid === result?.attrs.jid);
          if(currentSavedChatRoom.length === 0 || currentSavedChatRoom[0].toUpdate){
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
              toUpdate: false,
              description: ""
            };
            if(currentSavedChatRoom.length > 0 && currentSavedChatRoom[0].toUpdate){
              useStoreState.getState().updateUserChatRoom(roomData);
            }else{
              useStoreState.getState().setNewUserChatRoom(roomData);
            }
            //get message history in the room
            xmpp.getRoomArchiveStanza(roomJID, 1);
            lastRomJIDLoading = roomJID;
          }
        }
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
  useStoreState.getState().clearUserChatRooms();
  useStoreState.getState().setCurrentUntrackedChatRoom("");
  useStoreState.getState().clearBlackList();

  xmpp.client.send(xml("presence"));
  xmpp.getArchive(xmpp.client?.jid?.toString());
  defaultRooms.map((roomJID) => {
    xmpp.presenceInRoom(roomJID);
  });
  xmpp.getRooms();
  xmpp.getBlackList();
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
      const currentChatRooms = useStoreState.getState().userChatRooms;
      if(currentChatRooms.filter((el) => el.jid === jid)
          .length === 0){
        xmpp.subsribe(jid);
        xmpp.presenceInRoom(jid);
        xmpp.getRooms();
      }
    } else {
    }
  } else {
  }
};

const onBlackList = (stanza: Element, xmpp: any) => {
  if (stanza.attrs.id === "blackList") {
    stanza?.getChild("query").children.forEach((item: any) => {
      let listData = {
        date: Number(item.attrs.date),
        fullName: item.attrs.fullname,
        user: item.attrs.user
      }
      useStoreState.getState().saveInBlackList(listData)
    })
  }
}

const onBan = (stanza: Element) => {
  if(stanza.attrs.id === "ban"){
    console.log(stanza,"ban stanza")
  }
}

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
    // this.client.on("stanza", (stanza) => console.log(stanza));
    this.client.on("stanza", onMessageHistory);
    this.client.on("stanza", (stanza) => onGetLastMessageArchive(stanza, this));
    this.client.on("stanza", (stanza) => connectToUserRooms(stanza, this));
    this.client.on("stanza", (stanza) => onLastMessageArchive(stanza, this));
    this.client.on("stanza", (stanza) => onComposing(stanza));
    this.client.on("stanza", (stanza) => onInvite(stanza, this));
    this.client.on("stanza", (stanza) => onBlackList(stanza, this));
    this.client.on("stanza", (stanza) => onGetRoomInfo(stanza));
    this.client.on("stanza", (stanza) => onGetRoomMemberInfo(stanza));
    this.client.on("stanza", (stanza) => onChangeDescription(stanza, this));
    this.client.on("stanza", (stanza) => onPresenceInRoom(stanza));
    this.client.on('stanza', (stanza) => onBan(stanza));
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
        id: 'presenceInRoom'
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
          { to: otherUserId+"@dev.dxmpp.com" },
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

  blacklistUser = (
      userJIDToBlacklist: string,
  ) => {
    const stanza = xml(
        'iq',
        {
          from: this.client.jid?.toString(),

          type: 'set',
          id: "addToBlackList",
        },
        xml('query', {
          xmlns: 'ns:deepx:muc:user:block',
          user: userJIDToBlacklist,
        }),
    );
    this.client.send(stanza);
  };
  getBlackList = () => {
    const stanza = xml(
        'iq',
        {
          from: this.client.jid?.toString(),
          type: 'get',
          id: 'blackList',
        },
        xml('query', {
          xmlns: 'ns:deepx:muc:user:blocklist',
        }),
    );
    this.client.send(stanza);
  };

  getRoomMemberInfo = (roomJID) => {
    const stanza = xml(
      'iq',
      {
        from: this.client.jid?.toString(),
        type: 'get',
        id: 'roomMemberInfo',
      },
      xml('query', {
        xmlns: 'ns:room:last',
        room: roomJID,
      }),
    );
    this.client.send(stanza);
  }

  changeRoomDescription = (
    roomJID:string,
    newDescription:string,
  ) => {
    const stanza = xml(
      'iq',
      {
        from: this.client.jid?.toString(),
        id: 'changeRoomDescription',
        to: roomJID,
        type: 'set',
      },
      xml(
        'query',
        {xmlns: 'http://jabber.org/protocol/muc#owner'},
        xml(
          'x',
          {xmlns: 'jabber:x:data', type: 'submit'},
          xml(
            'field',
            {var: 'FORM_TYPE'},
            xml('value', {}, 'http://jabber.org/protocol/muc#roomconfig'),
          ),
          xml(
            'field',
            {var: 'muc#roomconfig_roomdesc'},
            xml('value', {}, newDescription),
          ),
        ),
      ),
    );
  
    this.client.send(stanza);
  }

  banUserStanza = (
    banUserId:string,
    roomJID:string
  ) => {
    const stanza = xml(
      'iq',
      {
        from: this.client.jid?.toString(),
        type: 'set',
        id: 'ban'
      },
      xml(
        'query',
        {
          xmlns:"ns:deepx:muc:user:ban",
          action:"ban",
          user:banUserId,
          type:"room",
          room:roomJID,
          time:"2592000",
          comment:"Ban"
        }
      )
    )

    this.client.send(stanza);
  }

  unbanUserStanza = (
    unbanUserId:string,
    roomJID:string,
  ) => {
    const stanza = xml(
      'iq',
      {
        from: this.client.jid?.toString(),
        type: 'set',
        id: 'unBan'
      },
      xml(
        'query',
        {
          xmlns:"ns:deepx:muc:user:ban",
          action:"unban",
          user:unbanUserId,
          type:'room',
          room:roomJID
        }
      )
    )
  
    this.client.send(stanza);
  }
}

export default new XmppClass();
