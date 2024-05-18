import { ModelChat, ModelChatMessage } from "../../models";
import { ws } from "../../ws";
import { getHistory } from "../xmppRequests/getHistory";
import { GetRoomsResp, getRooms } from "../xmppRequests/getRooms";

export async function chatList() {
    let rooms = await getRooms() as GetRoomsResp[]
    let chatList: Array<ModelChat> = []

    for (let room of rooms) {
        const messages = await getHistory(room.jid, 1, null)
        ws.presence([room.jid])
        const chat: ModelChat = {
            id: room.jid,
            allLoaded: false,
            background: room.room_background,
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
            thumbnail: room.room_thumbnail,
            title: room.name,
            usersCnt: room.users_cnt,
        }

        chatList.push(chat)
    }

    return chatList;
}