import { xml } from "@xmpp/client";
import { Element } from "ltx";

export const createMessage = (
  data: any,
  body: any,
  id: string,
  from: string
) => {
  const message = {
    id: Number(id),
    body: body.getText(),
    roomJID: from,
    date: new Date(+id.slice(0, 13)).toISOString(),
    key: Date.now() + Number(id),
    coinsInMessage: 0,
    numberOfReplies: [],
  };
  return message;
};

//core default
const onRealtimeMessage = async (stanza: Element) => {
  if (stanza.attrs.id === "sendMessage") {
    const body = stanza?.getChild("body");
    const data = stanza?.getChild("data");
    const replace = stanza?.getChild("replaced");
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

    const message = createMessage(data, body, id, stanza.attrs.from);
    return message;
  }
};

const onMessageHistory = async (stanza: any) => {
  console.log("<===", stanza.toString());
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
      ?.getChild("replaced");

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

    const message = createMessage(data, body, id, stanza.attrs.from);
    console.log("TEST ", message);
  }
};

const getListOfRooms = (xmpp: any) => {
  xmpp.client.send(xml("presence"));
  xmpp.getArchive(xmpp.client?.jid?.toString());
  xmpp.getRooms();
};

const onPresenceInRoom = (stanza: Element | any) => {
  if (stanza.attrs.id === "presenceInRoom") {
    const roomJID: string = stanza.attrs.from.split("/")[0];
    const role: string = stanza?.children[1]?.children[0]?.attrs.role;
    console.log({ roomJID, role });
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

export {
  getListOfRooms,
  onRealtimeMessage,
  onMessageHistory,
  onPresenceInRoom,
  onGetLastMessageArchive,
};
