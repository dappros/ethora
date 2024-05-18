import { xml } from "@xmpp/client"
import { useChatStore } from "../../store/useChatStore"
import { ModelChatMessage } from "../../models"
import { ws } from "../../ws"


export async function sendTextMessage(message: ModelChatMessage) {
    const id = `send-message:${Date.now().toString()}`

    const user = useChatStore.getState().me
    const xmlMessage = xml(
      'message',
      {
        to: message.from.chatId,
        type: 'groupchat',
        id: id
      },
      xml(
        'data',
        {
          xmlns: ws.service,
          senderFirstName: user.firstName,
          senderLastName: user.lastName,
          photoURL: user.profileImage,
          senderWalletAddress: user.walletAddress,
          senderJID: ws.client.jid.toString(),
          roomJid: message.from.chatId,
          isSystemMessage: false,
          tokenAmount: 0,
          quickReplies: '',
          notDisplayedValue: ''
        }
      ),
      xml(
        'body',
        {},
        message.text
      )
    )

    let stanzaHdlrPointer;

    const unsubscribe = () => {
      ws.client.off('stanza', stanzaHdlrPointer)
    }

    const responsePromise = new Promise((resolve, _) => {
      stanzaHdlrPointer = (stanza) => {
        if (stanza.is("message") && stanza.attrs["id"] === id) {
          const msg = stanza
          const text = msg.getChild('body')?.getText()

          if (text) {
            let parsedEl: any = {}

            const result = ws.realtimeMessageParser(msg)

            unsubscribe()
            resolve(result)
          }
        }
      }

      ws.client.on("stanza", stanzaHdlrPointer)

      ws.client.send(xmlMessage)
    })

    const timeoutPromise = ws.createTimeoutPromise(10000, unsubscribe)

    return Promise.race([responsePromise, timeoutPromise]);
  }