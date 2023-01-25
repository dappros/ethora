import xmpp, { xml } from "@xmpp/client";
import { Client } from "@xmpp/client";
import { Element } from "ltx";
import { defaultChats } from "./config/config";
import { CONFERENCEDOMAIN, DOMAIN, SERVICE } from "./constants";
import {
  TActiveRoomFilter,
  TMessageHistory,
  TRoomRoles,
  TUserChatRooms,
  replaceMessageListItemProps,
  useStoreState,
  IMainMessage,
} from "./store";
import { sendBrowserNotification } from "./utils";
import { history } from "./utils/history";

let lastMsgId: string = "";
let temporaryMessages: TMessageHistory[] = [];
let temporaryReplaceMessages: replaceMessageListItemProps[] = [];
let isGettingMessages: boolean = false;
let isGettingFirstMessages: boolean = false;
let lastRomJIDLoading: string = "";

export function walletToUsername(str: string) {
  if (str) {
    return str.replace(/([A-Z])/g, "_$1").toLowerCase();
  }
  return "";
}

export function usernameToWallet(str: string) {
  return str.replace(/_([a-z])/gm, (m1: string, m2: string) => {
    return m2.toUpperCase();
  });
}
const createMessage = (data: any, body: any, id: string, from: string) => {
  let msg = {
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
      isReply: data.attrs.isReply === "true" || false,
      showInChannel: data.attrs.showInChannel === "true" || false,
      isEdited: false,
      mainMessage: undefined,
    },
    roomJID: from,
    date: new Date().toISOString(),
    key: Date.now() + Number(id),
    coinsInMessage: 0,
    numberOfReplies: 0,
  };
  if (data.attrs.mainMessage) {
    try {
      const parsedMessage = JSON.parse(data.attrs.mainMessage);
      const mainMessage: IMainMessage = {
        text: parsedMessage.text || "",
        id: parsedMessage?.id,
        userName: parsedMessage.userName || "",
        createdAt: parsedMessage.createdAt,
        fileName: parsedMessage.fileName,
        imageLocation: parsedMessage.imageLocation,
        imagePreview: parsedMessage.imagePreview,
        mimeType: parsedMessage.mimeType,
        originalName: parsedMessage.originalName,
        size: parsedMessage.size,
        duration: parsedMessage.duration,
        waveForm: parsedMessage.waveForm,
        attachmentId: parsedMessage.attachmentId,
        wrappable: parsedMessage.wrappable === "true" || false,
        nftId: parsedMessage.mainMessageNftId,
        nftActionType: parsedMessage.nftActionType,
        contractAddress: parsedMessage.contractAddress,
        roomJid: parsedMessage.roomJid,
      };
      msg.data.mainMessage = mainMessage;
    } catch (error) {
      console.log(error, data.attrs.mainMessage);
    }
  }
  return msg;
};
const updateTemporaryMessagesRepliesCount = (messageId: number) => {
  const messageIndex = temporaryMessages.findIndex(
    (item) => item.id === messageId
  );

  if (!messageId || isNaN(messageId) || messageIndex === -1) {
    return;
  }
  const threadMessages = temporaryMessages.filter(
    (item) => item.data.mainMessage?.id === messageId
  );
  temporaryMessages[messageIndex].numberOfReplies = threadMessages.length;
};

export const createMainMessageForThread = (
  message: TMessageHistory
): string => {
  const data = {
    text: message.body,
    id: message.id,
    userName: message.data.senderFirstName + " " + message.data.senderLastName,
    createdAt: message.date,
    fileName: message.data.originalName,
    imageLocation: message.data?.location,
    imagePreview: message.data?.locationPreview,
    mimeType: message.data?.mimetype,
    originalName: message.data?.originalName,
    size: "",
    duration: "",
    waveForm: "",
    attachmentId: "",
    wrappable: "",
    nftActionType: "",
    contractAddress: "",
    roomJid: message.data.roomJid,
    nftId: "",
  };
  return JSON.stringify(data);
};

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

const getRoomGroup = (jid: string, userCount: number): TActiveRoomFilter => {
  const splittedJid = jid.split("@")[0];
  if (defaultChats[splittedJid]) {
    console.log();
    return "official";
  }
  return "groups";
};

const onRealtimeMessage = async (stanza: Element) => {
  if (stanza.attrs.id === "sendMessage") {
    const body = stanza?.getChild("body");
    const data = stanza?.getChild("data");
    const replace = stanza?.getChild("replace");
    const archived = stanza?.getChild("archived");

    const id = stanza.getChild("archived")?.attrs.id;
    if (!data || !body || !id) {
      return;
    }

    if (
      !data.attrs.senderFirstName ||
      !data.attrs.senderLastName ||
      !data.attrs.senderJID
    ) {
      return;
    }

    const msg = createMessage(data, body, id, stanza.attrs.from);
    const blackList = useStoreState
      .getState()
      .blackList.find((item) => item.user === msg.data.senderJID);

    if (blackList) {
      return;
    }

    if (replace) {
      const replaceMessageId = Number(replace.attrs.id);
      const messageString = body.getText();
      useStoreState.getState().replaceMessage(replaceMessageId, messageString);
    }

    if (data.attrs.isReply) {
      const messageId = Number(msg.data?.mainMessage?.id);
      useStoreState.getState().setNumberOfReplies(messageId);
    }
    useStoreState.getState().updateCounterChatRoom(data.attrs.roomJid);
    useStoreState.getState().updateMessageHistory([msg]);
    sendBrowserNotification(msg.body, () => {
      history.push("/chat/" + msg.roomJID.split("@")[0]);
    });
  }
};

const onMessageHistory = async (stanza: any) => {
  if (
    stanza.is("message") &&
    stanza.children[0].attrs.xmlns === "urn:xmpp:mam:2"
  ) {
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
    const replace = stanza
      .getChild("result")
      ?.getChild("forwarded")
      ?.getChild("message")
      ?.getChild("replace");

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

    const msg = createMessage(data, body, id, stanza.attrs.from);
   

    // console.log('TEST ', data.attrs)
    const blackList = useStoreState
      .getState()
      .blackList.find((item) => item.user === msg.data.senderJID);

      if(blackList) {
        return;
      }
    //if current stanza has replace tag
    if (replace) {
      console.log("replace:", stanza);
      //if message loading
      if (isGettingMessages) {
        const replaceItem: replaceMessageListItemProps = {
          replaceMessageId: Number(replace.attrs.id),
          replaceMessageText: body.getText(),
        };
        //add the replace item, which has the id of the main message to be edited, in a temporory array
        temporaryReplaceMessages.push(replaceItem);
      }
      //if message loading done
      if (!isGettingMessages) {
        const replaceMessageId = Number(replace.attrs.id);
        const messageString = body.getText();
        //replace body/text of message id in messageHistory array
        useStoreState
          .getState()
          .replaceMessage(replaceMessageId, messageString);
      }
    } else {
      if (isGettingMessages) {
        temporaryMessages.push(msg);
      }
      if (!isGettingMessages) {
        //check for messages in temp Replace message array agains the current stanza message id
        const replaceItem = temporaryReplaceMessages.find(
          (item) => item.replaceMessageId === msg.id
        );
        //if exists then replace the body with current stanza body
        if (replaceItem) {
          msg.body = replaceItem.replaceMessageText;
        }
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
      }
    }
    if (data.attrs.isReply) {
      const messageid = msg.data.mainMessage?.id;
      updateTemporaryMessagesRepliesCount(messageid);
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
        if (item.data.isSystemMessage && item.data.tokenAmount > 0) {
          useStoreState
            .getState()
            .updateCoinsInMessageHistory(
              Number(item.data.receiverMessageId),
              String(item.data.senderJID),
              Number(item.data.tokenAmount)
            );
        }
      });

      temporaryReplaceMessages.forEach((item) => {
        useStoreState
          .getState()
          .replaceMessage(item.replaceMessageId, item.replaceMessageText);
      });

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

const onGetRoomInfo = (stanza: Element | any) => {
  const userChatRooms = useStoreState.getState().userChatRooms;
  const currentRoomData = userChatRooms.filter(
    (e) => e.jid === stanza.attrs.from
  )[0];
  if (stanza.attrs.id === "roomInfo") {
    if (stanza.children[0] && currentRoomData) {
      const featureList = stanza.children[0].children.find(
        (item) => item.attrs.xmlns === "jabber:x:data"
      );
      const roomDescription = featureList.children.find(
        (item) => item.attrs.var === "muc#roominfo_description"
      ).children[0]?.children[0];
      const roomName = featureList.children.find(
        (item) => item.attrs.var === "muc#roomconfig_roomname"
      ).children[0]?.children[0];

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
      };
      useStoreState.getState().updateUserChatRoom(roomData);
    }
  }
};

const onGetRoomMemberInfo = (stanza: Element | any) => {
  if (stanza.attrs.id === "roomMemberInfo") {
    if (stanza.children.length) {
      const info = stanza.children[0].children.map((item) => item.attrs);
      useStoreState.getState().setRoomMemberInfo(info);
    }
  }
};

const onChangeDescription = (stanza: Element, xmpp: any) => {
  if (stanza.attrs.id === "changeRoomDescription") {
    // console.log(stanza)
    xmpp.getRoomInfo(stanza.attrs.from);
  }
};

const onChangeRoomName = (stanza: Element, xmpp: any) => {
  if (stanza.attrs.id === "changeRoomName") {
    xmpp.getRoomInfo(stanza.attrs.from);
  }
};

const onPresenceInRoom = (stanza: Element | any) => {
  if (stanza.attrs.id === "presenceInRoom") {
    const roomJID: string = stanza.attrs.from.split("/")[0];
    const role: string = stanza?.children[1]?.children[0]?.attrs.role;
    const elementObject: TRoomRoles = { roomJID: roomJID, role: role };
    useStoreState.getState().setRoomRoles(elementObject);
  }
};

const connectToUserRooms = (stanza: Element, xmpp: any) => {
  if (stanza.attrs.id === "getUserRooms") {
    if (stanza.getChild("query")?.children) {
      isGettingFirstMessages = true;
      useStoreState.getState().setLoaderArchive(true);
      let roomJID: string = "";
      stanza.getChild("query")?.children.forEach((result: any) => {
        const currentChatRooms = useStoreState.getState().userChatRooms;

        if (result?.attrs.name) {
          const currentSavedChatRoom = currentChatRooms.filter(
            (el) => el.jid === result?.attrs.jid
          );
          if (
            currentSavedChatRoom.length === 0 ||
            currentSavedChatRoom[0].toUpdate
          ) {
            roomJID = result.attrs.jid;
            xmpp.presenceInRoom(roomJID);
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
              group: getRoomGroup(roomJID, +result?.attrs.users_cnt),
            };
            if (
              currentSavedChatRoom.length > 0 &&
              currentSavedChatRoom[0].toUpdate
            ) {
              useStoreState.getState().updateUserChatRoom(roomData);
            } else {
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
  Object.keys(defaultChats).forEach((roomJID) => {
    xmpp.presenceInRoom(roomJID + CONFERENCEDOMAIN);
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
      if (currentChatRooms.filter((el) => el.jid === jid).length === 0) {
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
    const blackList = stanza?.getChild("query").children.map((item: any) => ({
      date: Number(item.attrs.date),
      fullName: item.attrs.fullname,
      user: item.attrs.user,
    }));
    useStoreState.getState().saveInBlackList(blackList);
  }
};

const onRemoveFromBlackList = (stanza: Element, xmpp: any) => {
  if (stanza.attrs.id === "removeFromBlackList") {
    console.log(stanza);
  }
};
const onNewSubscription = (stanza: Element, xmpp: XmppClass) => {
  if (stanza.attrs.id === "newSubscription") {
    xmpp.getRooms();
  }
};
const onRoomDesignChange = (stanza: Element, xmpp: XmppClass) => {
  if (stanza.attrs.id === "unsubscribe") {
    xmpp.getRooms();
  }
  if (
    stanza.attrs.id === "setRoomImage" ||
    stanza.attrs.id === "setRoomBackground"
  ) {
    xmpp.getRoomInfo(stanza.attrs.from);
  }
};

const onBan = (stanza: Element) => {
  if (stanza.attrs.id === "ban") {
    console.log(stanza, "ban stanza");
  }
};

//when messages are edited in realtime then capture broadcast with id "replaceMessage" and replace the text.
const onSendReplaceMessageStanza = (stanza: any) => {
  if (stanza.attrs.id === "replaceMessage") {
    const replaceMessageId = Number(
      stanza.children.find((item) => item.name === "replace").attrs.id
    );
    const messageString = stanza.children.find((item) => item.name === "body")
      .children[0];
    console.log(replaceMessageId, messageString);
    useStoreState.getState().replaceMessage(replaceMessageId, messageString);
  }
};

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
      service: SERVICE,
      username: walletToUsername(walletAddress),
      password,
    });

    this.client.start();

    this.client.on("online", (jid) => getListOfRooms(this));
    // this.client.on("stanza", (stanza) => console.log(stanza));
    this.client.on("stanza", onMessageHistory);
    this.client.on("stanza", (stanza) => onRealtimeMessage(stanza));
    this.client.on("stanza", (stanza) => onGetLastMessageArchive(stanza, this));
    this.client.on("stanza", (stanza) => connectToUserRooms(stanza, this));
    this.client.on("stanza", (stanza) => onLastMessageArchive(stanza, this));
    this.client.on("stanza", (stanza) => onComposing(stanza));
    this.client.on("stanza", (stanza) => onInvite(stanza, this));
    this.client.on("stanza", (stanza) => onBlackList(stanza, this));
    this.client.on("stanza", (stanza) => onGetRoomInfo(stanza));
    this.client.on("stanza", (stanza) => onGetRoomMemberInfo(stanza));
    this.client.on("stanza", (stanza) => onChangeDescription(stanza, this));
    this.client.on("stanza", (stanza) => onChangeRoomName(stanza, this));
    this.client.on("stanza", (stanza) => onPresenceInRoom(stanza));
    this.client.on("stanza", (stanza) => onBan(stanza));
    this.client.on("stanza", (stanza) => onRemoveFromBlackList(stanza, this));
    this.client.on("stanza", (stanza) => onBan(stanza));
    this.client.on("stanza", (stanza) => onNewSubscription(stanza, this));
    this.client.on("stanza", (stanza) => onRoomDesignChange(stanza, this));
    this.client.on("stanza", (stanza) => onSendReplaceMessageStanza(stanza));

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
}

export default new XmppClass();
