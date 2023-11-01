import xmpp from "@xmpp/client";

import { XMPP_SERVICE, XMPP_CONFERENCE } from "./constants";

const xml = xmpp.xml;

class XmppService {
  connect(username, password) {
    this.client = xmpp.client({
      service: XMPP_SERVICE,
      username,
      password,
    });

    this.client.on("stanza", (stanza) => {
      console.log("<----- ", stanza.toString());
    });

    this.client.on("online", () => console.log("xmpp is online"));
    this.client.on("disconnect", () => console.log("on diconnect"));
    this.client.on("close", () => console.log("on close"));

    this.client
      .start()
      .then(() => {})
      .catch((error) => {
        console.log(error);
        this.client.stop();
      });
  }

  getRooms() {
    const message = xml(
      "iq",
      {
        type: "get",
        id: "getRooms",
      },
      xml("query", { xmlns: "ns:getrooms" })
    );

    console.log("-----> ", message.toString());

    this.client.send(message);
  }

  presence(roomJid, nickname) {
    if (!roomJid.includes("@")) {
      roomJid = `${roomJid}@${XMPP_CONFERENCE}`;
    }

    let message = xml(
      "presence",
      {
        to: `${roomJid}/${nickname}`,
      },
      xml("x", "http://jabber.org/protocol/muc")
    );
    console.log("!!!!!!!!! ", message.toString());

    this.client.send(message);
  }

  getHistory(roomJid) {
    if (!roomJid.includes("@")) {
      roomJid = `${roomJid}@${XMPP_CONFERENCE}`;
    }

    const message = xml(
      "iq",
      {
        type: "set",
        to: roomJid,
        id: "getHistory",
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
    );

    console.log("-----> ", message.toString());

    this.client.send(message);
  }

  sendMessage(roomName, text) {
    if (!roomName.includes("@")) {
      roomName = `${roomName}@${XMPP_CONFERENCE}`;
    }

    const message = xml(
      "message",
      {
        to: roomName,
        type: "groupchat",
        id: "sendMessage",
      },
      xml("data", {
        xmlns: XMPP_SERVICE,
        senderFirstName: "bob",
        senderLastName: "bob",
        mucName: "mucName",
        inProd: "true",
        msgType: "message",
        push: "true",
      }),
      xml("body", {}, text)
    );

    console.log("-----> ", message.toString());

    this.client.send(message);
  }

  getArchiveFormField() {
    let message = xml(
      "iq",
      { id: "form1", type: "get" },
      xml("query", "urn:xmpp:mam:2")
    );
    this.client.send(message);
  }

  leaveRoom(roomJid) {
    if (!roomJid.includes("@")) {
      roomJid = `${roomJid}@${XMPP_CONFERENCE}`;
    }
    const message = xml("presence", {
      to: `${roomJid}/${this.client.jid.getLocal()}`,
      type: "unavailable",
    });

    console.log("!!!!!!!!!! ", message.toString());

    this.client.send(message);
  }

  deleteMessage(room, msgId) {
    if (!room.includes("@")) {
      room = `${room}@${XMPP_CONFERENCE}`;
    }
    const stanza = xml(
      "message",
      {
        from: this.client.jid?.toString(),
        to: room,
        id: "deleteMessageStanza",
        type: "groupchat",
      },
      xml("body", "wow"),
      xml("delete", {
        id: msgId,
      })
    );

    this.client.send(stanza);
  }

  editMessage(room, msgId, text) {
    if (!room.includes("@")) {
      room = `${room}@${XMPP_CONFERENCE}`;
    }

    const message = xml(
      "message",
      {
        id: "replaceMessage",
        type: "groupchat",
        to: room,
      },
      xml("replace", {
        id: msgId,
        xmlns: "urn:xmpp:message-correct:0",
        text
      })
    );

    console.log("-----> ", message.toString());

    this.client.send(message);
  }

  sendReaction(room, msgId, text) {
    if (!room.includes("@")) {
      room = `${room}@${XMPP_CONFERENCE}`;
    }

    const message = xml(
      "message",
      {
        id: Date.now().toString(),
        type: "groupchat",
        to: room,
      },
      xml("reaction", {
        id: msgId,
        xmlns: "urn:xmpp:reactions:0",
        short_name: text
      })
    );

    console.log("-----> ", message.toString());

    this.client.send(message);
  }

  subscribe(room) {
    if (!room.includes("@")) {
      room = `${room}@${XMPP_CONFERENCE}`;
    }

    const message = xml(
      "iq",
      {
        to: room,
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

    console.log("-----> ", message.toString());

    this.client.send(message);
  }

  unsubscribe(room) {
    if (!room.includes("@")) {
      room = `${room}@${XMPP_CONFERENCE}`;
    }

    const message = xml(
      "iq",
      {
        to: room,
        type: "set",
        id: "newSubscription",
      },
      xml(
        "unsubscribe",
        { xmlns: "urn:xmpp:mucsub:0" }
      )
    );

    console.log("-----> ", message.toString());

    this.client.send(message);
  }

  getConfiguration(room) {
    if (!room.includes("@")) {
      room = `${room}@${XMPP_CONFERENCE}`;
    }

    const message = xml(
      "iq",
      {
        to: room,
        type: "get",
        id: "getConfiguration",
      },
      xml(
        "query",
        { xmlns: "http://jabber.org/protocol/muc#owner" }
      )
    );

    console.log("-----> ", message.toString());

    this.client.send(message);
  }

  roomConfig(room, roomName, roomDescription = "") {
    if (!room.includes("@")) {
      room = `${room}@${XMPP_CONFERENCE}`;
    }

    const message = xml(
      "iq",
      {
        id: "roomConfig",
        to: room,
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
            xml("value", {}, roomName)
          ),
          xml(
            "field",
            { var: "muc#roomconfig_roomdesc" },
            xml("value", {}, roomDescription)
          )
        )
      )
    );

    this.client.send(message);
  }

  discoInfo(to) {
    const message = xml(
      "iq",
      {
        to: to,
        type: "get",
        id: "discoInfo",
      },
      xml("query", { xmlns: "http://jabber.org/protocol/disco#info" })
    );

    console.log("-----> ", message.toString());

    this.client.send(message);
  }

  discoItems(to) {
    const message = xml(
      "iq",
      {
        to: to,
        type: "get",
        id: "discoItems",
      },
      xml("query", { xmlns: "http://jabber.org/protocol/disco#items" })
    );

    console.log("-----> ", message.toString());

    this.client.send(message);
  }

  getMySubscriptions(roomService) {
    const message = xml(
      "iq",
      {
        to: roomService,
        type: "get",
        id: "getMySubscriptions",
      },
      xml("subscriptions", { xmlns: "urn:xmpp:mucsub:0" })
    );

    console.log("-----> ", message.toString());

    this.client.send(message);
  }

  myVcard() {
    const message = xml(
      // <iq from='stpeter@jabber.org/roundabout'
      //     id='v1'
      //     type='get'>
      //   <vCard xmlns='vcard-temp'/>
      // </iq>
      "iq",
      {
        type: "get",
        id: "v1"
      },
      xml(
        "vCard",
        {
          xmlns: "vcard-temp"
        }
      )
    )

    console.log("-----> ", message.toString());
    this.client.send(message);
  }

  otherVcard(jid) {
    const message = xml(
      // <iq from='stpeter@jabber.org/roundabout'
      //     id='v1'
      //     type='get'>
      //   <vCard xmlns='vcard-temp'/>
      // </iq>
      "iq",
      {
        type: "get",
        id: "v1",
        to: jid
      },
      xml(
        "vCard",
        {
          xmlns: "vcard-temp"
        }
      )
    )

    console.log("-----> ", message.toString());
    this.client.send(message);
  }

  updateMyVcard(vCard) {
    const message = xml(
      "iq",
      {
        id: "v2",
        type: "set"
      },
      xml(
        "vCard",
        "vcard-temp",
        xml("FN", {}, vCard.FN),
      )
    )
    console.log("-----> ", message.toString());
    this.client.send(message);
  }

  getRoster() {
    const message = xml(
      "iq",
      {
        id: "getRoster",
        type: "get"
      },
      xml(
        "query",
        "jabber:iq:roster"
      )
    )
    console.log("-----> ", message.toString());
    this.client.send(message);
  }

  setRoster(jid) {
    const message = xml(
      "iq",
      {
        id: "setRoster",
        type: "set"
      },
      xml(
        "query",
        "jabber:iq:roster",
        xml(
          "item",
          {
            jid: jid
          }
        )
      )
    )

    console.log("-----> ", message.toString());
    this.client.send(message)
  }

  removeRoster(jid) {
    const message = xml(
      "iq",
      {
        id: "setRoster",
        type: "set"
      },
      xml(
        "query",
        "jabber:iq:roster",
        xml(
          "item",
          {
            jid: jid,
            subscription: "remove"
          }
        )
      )
    )

    console.log("removeRoster -----> ", message.toString());
    this.client.send(message)
  }

  initialPresence() {
    const message = xml(
      "presence",
    )

    console.log(message.toString());
    this.client.send(message)
  }

  stop() {
    this.client.stop()
  }
}

export default new XmppService();
