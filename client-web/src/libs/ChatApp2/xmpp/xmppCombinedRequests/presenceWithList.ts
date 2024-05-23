import { ModelChat } from "../../models";
import { ws } from "../../ws";
import { getHistory } from "../xmppRequests/getHistory";

export async function presenceWithList(chats: Array<string>) {
    let chatList: Array<ModelChat> = []
    for (let room of chats) {
        ws.presence([room])
        const messages = await getHistory(room, 1, null)

        const chat: ModelChat = {
            id: room,
            allLoaded: false,
            background: 'none',
            editMessage: null,
            hasLoaded: false,
            // TODO get unread logic from xmpp
            hasUnread: false,
            loading: false,
            messages: messages,
            // TODO get muted from xmpp
            muted: false,
            sending: false,
            threadsMessages: null,
            thumbnail: 'name',
            title: 'todo',
            usersCnt: '0',
        }

        chatList.push(chat)
    }

    return chatList
}
