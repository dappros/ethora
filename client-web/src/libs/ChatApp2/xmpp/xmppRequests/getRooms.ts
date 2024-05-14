import { Element } from "ltx";
import { ws } from "../../ws";
import { xml } from "@xmpp/client";

export interface GetRoomsResp {
    name: string;
    users_cnt: string;
    room_background: string;
    room_thumbnail: string;
    jid: string
} 

export async function getRooms(): Promise<any> {
    const id = `get-rooms:${Date.now().toString()}`

    let stanzaHdlrPointer;

    const unsubscribe = () => {
      ws.client.off('stanza', stanzaHdlrPointer)
    }

    const responsePromise = new Promise((resolve, reject) => {
      stanzaHdlrPointer = (stanza: Element) => {
        if (stanza.is("iq") && stanza.attrs.id === id && stanza.attrs.type === "result") {
          const fields = stanza.getChild('query')?.getChildren('room')

          const response = fields.map((el: Element) => {
            const { name, users_cnt, room_background, room_thumbnail, jid } = el.attrs
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

      ws.client?.on("stanza", stanzaHdlrPointer);

      const message = xml(
        "iq",
        {
          type: "get",
          id: id,
        },
        xml("query", { xmlns: "ns:getrooms" })
      )

      ws.client.send(message)
    })

    const timeoutPromise = ws.createTimeoutPromise(10_000, unsubscribe)

    return Promise.race([responsePromise, timeoutPromise]);
}