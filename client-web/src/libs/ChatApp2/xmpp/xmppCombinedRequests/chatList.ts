import { ModelChatMessage } from "../../models";
import { getHistory } from "../xmppRequests/getHistory";
import { GetRoomsResp, getRooms } from "../xmppRequests/getRooms";

export async function chatList() {
    let rooms = await getRooms() as GetRoomsResp[]

    let messages: Array<ModelChatMessage> = []
    for (let room of rooms) {
        const [message] = await getHistory(room.jid, 1)
        messages.push(message)
    }
}