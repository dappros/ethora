import xmpp, { Client, xml } from "@xmpp/client";
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

        this.client.on('disconnect', () => { this.onclose() })
        this.client.on('error', () => log('xmpp cliet error'))
        this.client.on('online', () => {
            this.onmessage({ status: 'online' })
            this.initPresence()
        })
        this.client.on('stanza', this.onStanza.bind(this))
        this.client.start()
    }

    onStanza(stanza: Element) {
        // if we have direct archived child it is not getHistory request
        if (stanza.is("message") && stanza.attrs["type"] === 'groupchat' && stanza.getChild('archived')) {
            // handling stanza id who includes : in different place
            if (stanza.attrs['id'].includes(":")) {
                return
            }

            const parsed = this.realtimeMessageParser(stanza)
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
        this.client.send(xml("presence"))
    }

    parseMucFromAttr(from) {
        const [chatId, nickname] = from.split('/')

        return {
            chatId,
            nickname
        }
    }

    realtimeMessageParser(stanza: Element): any {
        const msg = stanza
        const text = msg.getChild('body')?.getText()
        const dataAttrs = msg.getChild('data')?.attrs
        const archived = msg.getChild('archived')

        if (text && dataAttrs) {
            let parsedEl: any = {}

            parsedEl.id = archived.attrs.id
            parsedEl.text = text
            parsedEl.from = this.parseMucFromAttr(msg.attrs.from)
            parsedEl.created = parsedEl.id.slice(0, 13)
            parsedEl.isMe = this.isMe(msg.attrs.from)

            parsedEl.dataAttrs = dataAttrs

            if (parsedEl.dataAttrs.mainMessage) {
                parsedEl.dataAttrs.mainMessage = parseJSON(parsedEl.dataAttrs.mainMessage)
            }

            return parsedEl
        }
    }

    presence(rooms: string[]) {
        rooms
            .map((el) => `${el}/${this.client.jid?.getLocal()}`)
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
    }

    createTimeoutPromise(ms, unsubscribe) {
        return new Promise((_, reject) => {
            setTimeout(() => {
                try {
                    unsubscribe()
                } catch (e) { }
                reject()
            }, ms)
        })
    }

    isMe(from: string) {
        return from.endsWith(this.client.jid.getLocal())
    }
}
