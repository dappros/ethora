import { xml } from "@xmpp/client";
import { Element } from "ltx";
import { addMessage } from "../store/chatSlice";
import { store } from "../store";

// TO DO: we are thinking to refactor this code in the following way:
// each stanza will be parsed for 'type'
// then it will be handled based on the type
// XMPP parsing will be done universally as a pre-processing step
// then handlers for different types will work with a Javascript object
// types: standard, coin transfer, is composing, attachment (media), token (nft) or smart contract
// types can be added into our chat protocol (XMPP stanza add field type="") to make it easier to parse here

export const createMessage = (
  data: any,
  body: any,
  id: string,
  from: string
) => {
  const message = {
    id: id,
    body: body.getText(),
    roomJID: from,
    date: new Date(+id.slice(0, 13)).toISOString(),
    key: `${Date.now() + Number(id)}`,
    coinsInMessage: data?.coinsInMessage,
    numberOfReplies: data?.numberOfReplies,
    isSystemMessage: data?.isSystemMessage,
    isMediafile: data?.isMediafile,
    locationPreview: data?.locationPreview,
    user: {
      id: data?.senderWalletAddress,
      name: `${data?.senderFirstName} ${data?.senderLastName}`,
      avatar: data?.photoURL,
      jid: data?.senderJID,
    },
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
  // console.log("<===", stanza.toString());
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

    const message = createMessage(data.attrs, body, id, stanza.attrs.from);

    store.dispatch(addMessage(message));
  }
};

const getListOfRooms = (xmpp: any) => {
  console.log("xmpp", xmpp);
  xmpp.client.send(xml("presence"));
  // xmpp.getArchive(xmpp.client?.jid?.toString());
  xmpp.getArchive("0x6C394B10F5Da4141b99DB2Ad424C5688c3f202B3");
  xmpp.getRooms();
};

const onPresenceInRoom = (stanza: Element | any) => {
  if (stanza.attrs.id === "presenceInRoom") {
    const roomJID: string = stanza.attrs.from.split("/")[0];
    const role: string = stanza?.children[1]?.children[0]?.attrs.role;
    // console.log({ roomJID, role });
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
