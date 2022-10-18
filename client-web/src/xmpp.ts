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

const onMessageHistory = async (stanza: Element) => {
    if (stanza.is('message')) {
            console.log('Got a message')

            const body = stanza.getChild('result')?.getChild('forwarded')?.getChild('message')?.getChild('body')
            const data = stanza.getChild('result')?.getChild('forwarded')?.getChild('message')?.getChild('data')
            const delay = stanza.getChild('result')?.getChild('forwarded')?.getChild('delay')
            const id = stanza.getChild('result')?.attrs.id

            if (!data || !body || !delay || !id) {
                return
            }

            if (!data.attrs.senderFirstName ||  !data.attrs.senderLastName) {
                return
            }
            const msg = {
                id,
                body: body.getText(),
                data: data.attrs,
                roomJID: stanza.attrs.from,
                date: delay.attrs.stamp
            }
            console.log('Saved the message: ',body.getText())
            useStoreState.getState().setNewMessageHistory(msg)
            useStoreState.getState().sortMessageHistory();
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
      this.getRooms();
      useStoreState.getState().clearMessageHistory();
        // defaultRooms.forEach((room) => {
      //   this.subsribe(room);
      // });
    });

    this.client.on("stanza", (stanza) => {
        if (stanza.attrs.id === "sendMessage") {
            const data = stanza.getChild('stanza-id')
            if(data){
                this.getLastMessageArchive(data.attrs.by)
                return;
            }
            return onMessage(stanza);
        }
        if(stanza.attrs.id === "getUserRooms"){
            if(stanza.getChild('query')?.children){
                useStoreState.getState().clearUserChatRooms()
                stanza.getChild('query')?.children.forEach((result: Object) => {
                    // @ts-ignore
                    const roomJID: string = result.attrs.jid;
                        this.presenceInRoom(roomJID)
                        console.log('RESULT => ', roomJID);

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
                        }
                        console.log(roomData)
                        // @ts-ignore
                        useStoreState.getState().setNewUserChatRoom(roomData);
                        this.getRoomArchiveStanza(roomJID)
                })
            }
        }
        return onMessageHistory(stanza);
    });
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
    presenceInRoom(room: string) {
        const presence = xml(
            'presence',
            {
                from: this.client.jid?.toString(),
                to: room+'/'+this.client.jid?.getLocal(),
            },
            xml('x', 'http://jabber.org/protocol/muc'),
        );
        this.client.send(presence);
    }

    getRoomArchiveStanza(chat_jid: string) {
        let message = xml(
            'iq',
            {
                type: 'set',
                to: chat_jid,
                id: 'GetArchive',
            },
            xml(
                'query',
                {xmlns: 'urn:xmpp:mam:2'},
                xml(
                    'set',
                    {xmlns: 'http://jabber.org/protocol/rsm'},
                    xml('max', {}, '10'),
                    xml('before'),
                ),
            ),
        );
        this.client.send(message);
    }

    getPaginatedArchive = (
        chat_jid: string,
        firstUserMessageID: string,
    ) => {
      console.log(chat_jid, ' ==  ', firstUserMessageID)
        const message = xml(
            'iq',
            {
                type: 'set',
                to: chat_jid,
                id: 'paginatedArchive',
            },
            xml(
                'query',
                {xmlns: 'urn:xmpp:mam:2'},
                xml(
                    'set',
                    {xmlns: 'http://jabber.org/protocol/rsm'},
                    xml('max', {}, '10'),
                    xml('before', {}, firstUserMessageID),
                ),
            ),
        );
        this.client.send(message);
    }

    getLastMessageArchive(chat_jid: string) {
        let message = xml(
            'iq',
            {
                type: 'set',
                to: chat_jid,
                id: 'GetArchive',
            },
            xml(
                'query',
                {xmlns: 'urn:xmpp:mam:2'},
                xml(
                    'set',
                    {xmlns: 'http://jabber.org/protocol/rsm'},
                    xml('max', {}, '1'),
                    xml('before'),
                ),
            ),
        );
        this.client.send(message);
    }

    test() {
      console.log(this.client)
    }

    sendMessage(roomJID: string, firstName: string, lastName: string, photo: string, walletAddress: string, userMessage: string) {
      console.log('SENDER JID ', this.client.jid)
      // console.log('SENDER JID ', this.client.jid?.toString())
      const message = xml(
          'message', {
          to: roomJID,
          type: 'groupchat',
          id: "sendMessage"
      }, xml('data', {
          xmlns: "wss://dev.dxmpp.com:5443/ws",
          senderFirstName: firstName,
          senderLastName: lastName,
          photoURL: photo,
          senderJID: this.client.jid?.toString(),
          senderWalletAddress: walletAddress,
          roomJid: roomJID,
          isSystemMessage: false,
          tokenAmount: 0,
          quickReplies: []
      }), xml('body', {}, userMessage));
        this.client.send(message);
    }
}

export default new XmppClass();
