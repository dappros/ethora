import xmpp, { xml } from "@xmpp/client";
import { Client } from "@xmpp/client";
import { Element } from "ltx";
import { TMessageHistory, useStoreState } from "./store";

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
  if (stanza.is("message")) {
    if (stanza.attrs.id === "sendMessage") {
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
        xmlns: data.attrs.xmlns,
      },
      roomJID: stanza.attrs.from,
      date: delay.attrs.stamp,
      key: Date.now() + Number(id),
    };
    if (isGettingMessages) {
      temporaryMessages.push(msg);
    }
    if (!isGettingMessages) {
      useStoreState.getState().setNewMessageHistory(msg);
      useStoreState.getState().sortMessageHistory();
    }
    if (stanza.attrs.to.split("@")[0] !== data.attrs.senderJID.split("@")[0] &&
        !isGettingFirstMessages) {
      useStoreState.getState().updateCounterChatRoom(data.attrs.roomJid);
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
      stanza.getChild("query")?.children.forEach((result: Object) => {
        // @ts-ignore
        if (result?.attrs.name) {
          // @ts-ignore
          roomJID = result.attrs.jid;
          xmpp.presenceInRoom(roomJID);

          const roomData = {
            jid: roomJID,
            // @ts-ignore
            name: result?.attrs.name,
            // @ts-ignore
            room_background: result?.attrs.room_background,
            // @ts-ignore
            room_thumbnail: result?.attrs.room_thumbnail,
            // @ts-ignore
            users_cnt: result?.attrs.users_cnt,
            unreadMessages: 0,
            composing: "",
          };
          // @ts-ignore
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
    const recipientID = stanza.attrs.to.split("@")[0];
    const senderID = stanza.getChild("data").attrs.manipulatedWalletAddress;

    if (recipientID === senderID) {
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
  defaultRooms.map((roomJID) => {
    xmpp.presenceInRoom(roomJID);
  });
  xmpp.getRooms();
  useStoreState.getState().clearMessageHistory();
};

const defaultRooms = [
  "1c525d51b2a0e9d91819933295fcd82ba670371b92c0bf45ba1ba7fb904dbcdc@conference.dev.dxmpp.com",
  "d0df15e359b5d49aaa965bca475155b81784d9e4c5f242cebe405ae0f0046a22@conference.dev.dxmpp.com",
  "fd6488675183a9db2005879a945bf5727c8594eaae5cdbd35cb0b02c5751760e@conference.dev.dxmpp.com",
];

class XmppClass {
  public client!: Client;

  init(walletAddress: string, password: string) {
    console.log("init ", walletAddress, password);
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

    this.client.on("offline", () => console.log("offline"));
    this.client.on("error", (error) => {
      console.log("xmmpp on error ", error);
      this.client.stop();
      alert("xmmpp error, terminating collection");
    });
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
    userMessage: string
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
      }),
      xml("body", {}, userMessage)
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

  isComposing = (
      walletAddress: string,
      chatJID: string,
      fullName: string,
  ) => {
    const message = xml(
        'message',
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
        }),
    );
    this.client.send(message);
  };

  pausedComposing = (
      walletAddress: string,
      chatJID: string
  ) => {
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
        }),
    );
    this.client.send(message);
  };
}

export default new XmppClass();
