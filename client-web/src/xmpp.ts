import { darkScrollbar } from "@mui/material";
import xmpp, { xml } from "@xmpp/client";
import { Client } from "@xmpp/client";
import {Element} from 'ltx'
import {useStoreState} from './store'

export function walletToUsername(str: string) {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

export function usernameToWallet(str: string) {
  str.replace(/_([a-z])/gm, (m1:string, m2:string) => {
    return m2.toUpperCase();
  });
}

const onMessage = async (stanza: Element) => {
  if (stanza.is('message')) {
    if (stanza.attrs.id === "sendMessage") {
      const body = stanza.getChild('body')
      const data = stanza.getChild('data')

      if (!data || !body) {
        return
      }

      if (!data.attrs.senderFirstName ||  !data.attrs.senderLastName) {
        return
      }

      const msg = {
        body: body.getText(),
        firsName: data.attrs.senderFirstName,
        lastName: data.attrs.senderLastName,
        wallet: data.attrs.senderWalletAddress,
        from: stanza.attrs.from,
        room: stanza.attrs.from.toString().split('/')[0]
      }

      console.log('+++++ ', msg)

      useStoreState.getState().setNewMessage(msg)
    }
  }
}

const defaultRooms = [
  "1c525d51b2a0e9d91819933295fcd82ba670371b92c0bf45ba1ba7fb904dbcdc@conference.dev.dxmpp.com",
  // "d0df15e359b5d49aaa965bca475155b81784d9e4c5f242cebe405ae0f0046a22@conference.dev.dxmpp.com",
  // "fd6488675183a9db2005879a945bf5727c8594eaae5cdbd35cb0b02c5751760e@conference.dev.dxmpp.com",
];

class XmppClass {
  public client!: Client;

  init(walletAddress: string, password: string) {
    console.log('init ', walletAddress, password)
    this.client = xmpp.client({
      service: "wss://dev.dxmpp.com:5443/ws",
      username: walletToUsername(walletAddress),
      password,
    });

    this.client.start();

    this.client.on("online", (jid) => {
      console.log("online");
      // this.client.send(xml('presence'))
      // this.getRooms()
      // defaultRooms.forEach((room) => {
      //   this.subsribe(room);
      // });
    });

    this.client.on("stanza", onMessage);
    this.client.on("stanza", (stanza) => console.log(stanza.toString()))

    this.client.on("offline", () => console.log("offline"));
    this.client.on("error", (error) => console.log("on error ", error));
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

    this.client.send(message)
  }

  discoInfo() {
    const message = xml(
      "iq",
      {
        from: this.client?.jid?.toString(),
        to: this.client?.jid?.getDomain(),
        type: 'get',
        id: 'discover'
      },
      xml("query", { xmlns: 'http://jabber.org/protocol/disco#info' })
    )

    this.client.send(message)
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
      xml(
        "unsubscribe",
        { xmlns: "urn:xmpp:mucsub:0" }
      )
    );

    this.client.send(message); 
  }

  getRooms() {
    const message = xml(
      'iq',
      {
        type: 'get',
        from: this.client.jid?.toString(),
        id: 'getUserRooms',
      },
      xml('query', {xmlns: 'ns:getrooms'}),
    );
    this.client.send(message);
  }

  getVcard(username: string) {
    console.log(username + '@' + this.client.jid?.getDomain())
    if (username !== this.client.jid?.getLocal()) {
      // get other vcard
      const message = xml(
        'iq',
        {
          from: this.client.jid?.toString(),
          id: 'vCardOther',
          to: username + '@' + this.client.jid?.getDomain(),
          type: 'get',
        },
        xml('vCard', {xmlns: 'vcard-temp'}),
      );
    
      this.client.send(message);
    } else {
      const message = xml(
        'iq',
        {
          from: username + '@' + this.client.jid?.getDomain(),
          id: 'vCardMy',
          type: 'get',
        },
        xml('vCard', {
          xmlns: 'vcard-temp',
        }),
      );
      this.client.send(message);
    }
  }

  presence() {
    this.client.send(xml('presence'))
  }

  botPresence(room: string) {
    const xmlMsg = xml(
      'presence',
      {
        from: this.client.jid?.toString(),
        to: `${room}/${this.client.jid?.getLocal()}` ,
      },
      xml('x', 'http://jabber.org/protocol/muc')
    )
    this.client.send(xmlMsg)
  }

  roomPresence(room: string) {
    const presence = xml(
      'presence',
      {
        from: this.client.jid?.toString(),
        to: `${room}/${this.client.jid?.getLocal()}`,
      },
      xml('x', 'http://jabber.org/protocol/muc'),
    );
    this.client.send(presence);
  }
}

export default new XmppClass();
