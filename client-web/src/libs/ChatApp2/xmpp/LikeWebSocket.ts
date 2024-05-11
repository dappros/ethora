import xmpp, { Client } from "@xmpp/client";
import { Element } from "ltx";
import { parseJSON } from "../utils/parseJson";

const log = console.log

export class LikeWebSocket {
    client: Client;
    host: string;
    conference: string;
    username: string;
    service: string;
    onclose: () => void;
    onmessage: (data: any) => void;

    constructor(url: string, username: string, password: string) {
        this.host = url.match(/wss:\/\/([^:/]+)/)[1]
        this.conference = `conference.${this.host}`
        this.username = username
        this.service = url
    
        this.client = xmpp.client({
          service: url,
          username: username,
          password: password,
        })

        this.client.on('disconnect', () => {this.onclose()})
        this.client.on('error', () => log('xmpp cliet error'))
        this.client.on('online', () => {
            this.onmessage({status: 'online'})
            this.initPresence()
        })
        this.client.on('stanza', this.onStanza)
        this.client.on('status', (status) => console.log(status))
        this.client.start()
    }

    onStanza(stanza: Element) {
        // if we have direct archived child it is not getHistory request
        if (stanza.is("message") && stanza.attrs["type"] === 'groupchat' && stanza.getChild('archived')) {
            const parsed = realtimeMessageParser(stanza)
            if (parsed) {
                const data = {
                    operation: 'chat_new_message',
                    message: parsed
                }
                this.onmessage(data)
            }
        }
    }

    close() {
        this.client.stop()
    }

    requestChatList() {

    }

    initPresence() {

    }
}

function realtimeMessageParser(stanza: Element): any {
    const msg = stanza
    const text = msg.getChild('body')?.getText()
    const dataAttrs = msg.getChild('data')?.attrs
    const archived = msg.getChild('archived')

    if (text && dataAttrs) {
        let parsedEl: any = {}

        parsedEl.text = text
        parsedEl.from = parseMucFromAttr(msg.attrs.from)
        parsedEl.id = archived.attrs.id
        parsedEl.dataAttrs = dataAttrs

        if (parsedEl.dataAttrs.mainMessage) {
            parsedEl.dataAttrs.mainMessage = parseJSON(parsedEl.dataAttrs.mainMessage)
        }

        return parsedEl
    }
}

function parseMucFromAttr(from) {
    const [chatId, nickname] = from.split('/')

    return {
        chatId,
        nickname
    }
}