import { Element } from "ltx";
import { ModelChatMessage } from "../../models";
import { ws } from "../../ws";
import { xml } from "@xmpp/client";
import { parseJSON } from "../../utils/parseJson";

export function getHistory(room: string, max: number, before: string | null): Promise<ModelChatMessage[]> {
    const id = `get-history:${Date.now().toString()}`

    let stanzaHdlrPointer;

    const unsubscribe = () => {
        ws.client.off('stanza', stanzaHdlrPointer)
    }

    const responsePromise = new Promise((resolve, reject) => {
      let messages: Element[] = []

      stanzaHdlrPointer = (stanza) => {
        const result = stanza.getChild('result')

        if (stanza.is('message') && stanza.attrs['from'] && stanza.attrs['from'].startsWith(room) && result) {
          const messageEl = result.getChild('forwarded')?.getChild('message')
          messages.push(messageEl)
        }

        if (stanza.is('iq') && stanza.attrs['id'] === id && stanza.attrs['type'] === 'result') {
          const parsedMessges: Array<any> = []
          for (const msg of messages) {
            const text = msg.getChild('body')?.getText()
            if (text) {
              let parsedEl: any = {}

              const data = msg.getChild('data')
              if (!data || !data.attrs) {
                continue
              }

              parsedEl.id = msg.getChild('archived')?.attrs['id']
              parsedEl.text = text
              parsedEl.from = ws.parseMucFromAttr(msg.attrs.from)
              parsedEl.created = parsedEl.id.slice(0, 13)
              parsedEl.isMe = ws.isMe(msg.attrs.from)

              parsedEl.dataAttrs = data.attrs

              // ignore messages wich has isReply but there is no mainMessage field
              if (parsedEl.isReply === "true" && !parsedEl.mainMessage) {
                continue
              }

              if (parsedEl.mainMessage) {
                parsedEl.mainMessage = parseJSON(parsedEl.mainMessage)
              }

              // TEMP
              parsedEl.emojis = ['1f600', '1f603']

              parsedMessges.push(parsedEl)
            }
          }
          unsubscribe()
          resolve(parsedMessges)
        }

        if (stanza.is("iq") && stanza.attrs.id === id && stanza.attrs.type === "error") {
          unsubscribe()
          reject()
        }
      }

      ws.client?.on("stanza", stanzaHdlrPointer);

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

      ws.client.send(message)
    })

    const timeoutPromise = ws.createTimeoutPromise(10000, unsubscribe)

    return Promise.race([responsePromise, timeoutPromise]) as Promise<ModelChatMessage[]>;
}