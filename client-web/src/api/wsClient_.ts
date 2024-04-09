import xmpp from "@xmpp/client";
import { Element } from "ltx";
import { MessageType } from "../types/xmpp";

const xml = xmpp.xml;


export const wsClient = {
  client: null,
  host: '',
  coference: '',

  init(service: string, username: string, password: string ) {
    this.host = service.match(/wss:\/\/([^:/]+)/)[1]
    this.conference = `conference.${this.host}`

    this.client = xmpp.client({
      service: service,
      username: username,
      password: password,
    })
  },

  async connect() {
    return new Promise((resolve, reject) => {
      if (this.client) {
        this.client.on("online", (jid) => {
          console.log("xmpp on online")
          this.client.send(xml("presence"))
          resolve(jid)
        })
        this.client.on("connect", () => console.log("=-> xmpp on connect"))
        this.client.on("close", () => console.log("=-> xmpp client on close"))
        this.client.on("disconnect", () => console.log("=-> xmpp client on disconnect"))
        this.client.on("error", reject)

        this.client.start()
      } else {
        reject(new Error("Client is not initialized"))
      }
    })
  },

  stop() {
    if (this.client) {
      this.client.stop()
    }
  },

  presence(rooms: string[]) {
    rooms
      .map((el) => `${el}@${this.conference}/${this.client.jid?.getLocal()}`)
      .forEach((to) => {
        this.client.send(
          xml(
            "presence",
            {
              from: this.client.jid?.toString(),
              to
            },
            xml("x", "http://jabber.org/protocol/muc")
          )
        )
    })
  },

  async getRooms(): Promise<Array<{name: string, users_cnt: string, room_background: string, room_thumbnail: string, jid: string}> | null> {
    const id = `get-rooms:${Date.now().toString()}`

    let stanzaHdlrPointer;

    const unsubscribe = () => {
      this.client.off('stanza', stanzaHdlrPointer)
    }

    const responsePromise = new Promise((resolve, reject) => {
      stanzaHdlrPointer = (stanza) => {
        if (stanza.is("iq") && stanza.attrs.id === id && stanza.attrs.type === "result") {
          const fields = stanza.getChild('query')?.getChildren('room')

          const response = fields.map((el: Element) => {
            const {name, users_cnt, room_background, room_thumbnail, jid} = el.attrs
            return {
              name, users_cnt, room_background, room_thumbnail, jid
            }
          })
          unsubscribe()
          resolve(response)
        }

        if (stanza.is("iq") && stanza.attrs.id === id && stanza.attrs.type === "error") {
          unsubscribe()
          reject()
        }
      }

      this.client?.on("stanza", stanzaHdlrPointer);

      const message = xml(
        "iq",
        {
          type: "get",
          id: id,
        },
        xml("query", { xmlns: "ns:getrooms" })
      )

      this.client.send(message)
    })

    const timeoutPromise = createTimeoutPromise(10_000, unsubscribe)

    try {
      const res = await Promise.race([responsePromise, timeoutPromise]);
      return res as Array<{name: string, users_cnt: string, room_background: string, room_thumbnail: string, jid: string}>
    } catch (e) {
      return null
    }
  },

  async getHistory(room: string, max: number, before?: number) {
    const id = `get-history:${Date.now().toString()}`

    let stanzaHdlrPointer;

    const unsubscribe = () => {
      this.client.off('stanza', stanzaHdlrPointer)
    }

    const responsePromise = new Promise((resolve, reject) => {
      let messages: Element[] = []

      stanzaHdlrPointer = (stanza) => {
        if (stanza.is('message') && stanza.attrs['from'] && stanza.attrs['from'].startsWith(room)) {
          const result = stanza.getChild('result')

          if (result) {
            const messageEl = result.getChild('forwarded')?.getChild('message')
  
            messages.push(messageEl)
          }
        }

        if (stanza.is('iq') && stanza.attrs['id'] === id && stanza.attrs['type'] === 'result') {
          let result: Record<string, string>[] = []

          for (const msg of messages) {
            const text = msg.getChild('body')?.getText()
            if (text) {
              let parsedEl: Record<string, string> = {}

              parsedEl.text = text
              parsedEl.from = msg.attrs['from']
              parsedEl.id = msg.getChild('archived')?.attrs['id']
              const data = msg.getChild('data')

              for (const [key, value] of Object.entries(data.attrs)) {
                parsedEl[key] = value
              }

              result.push(parsedEl)
            }
          }
          unsubscribe()
          resolve(result)
        }

        if (stanza.is("iq") && stanza.attrs.id === id && stanza.attrs.type === "error") {
          unsubscribe()
          reject()
        }
      }

      this.client?.on("stanza", stanzaHdlrPointer);

      const message = xml(
        "iq",
        {
          type: "set",
          to: room,
          id: id,
        },
        xml(
          "query",
          { xmlns: "urn:xmpp:mam:2" },
          xml(
            "set",
            { xmlns: "http://jabber.org/protocol/rsm" },
            xml("max", {}, max.toString()),
            before ? xml("before", {}, before.toString()) : xml("before")
          )
        )
      )
      this.client.send(message)
    })

    const timeoutPromise = createTimeoutPromise(10000, unsubscribe)

    try {
      const res = await Promise.race([responsePromise, timeoutPromise]);
      return res
    } catch (e) {
      console.log("=-> error ", e)
      return null
    }
  }
}

function createTimeoutPromise(ms, unsubscribe) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      try {
        unsubscribe()
      } catch (e) { }
      reject()
    }, ms)
  })
}
