import { ConversationItem } from "./ConversationItem";
import { useChatStore } from "../../store_";

export function ConversationsList() {
    const rooms = useChatStore((state) => state.rooms)
    const setCurrentRoom = useChatStore((state) => state.setCurrentRoom)
    const setCurrentThreadMessage = useChatStore((state) => state.setCurrentThreadMessage)
    const currentRoom = useChatStore((state) => state.currentRoom)

    const onConversationClick = (room, e) => {
        e.preventDefault()
        console.log(e)

        setCurrentRoom(room)
        setCurrentThreadMessage(null)
    }

    return (
        <div>
            {
                Object.keys(rooms).map((jid) => {
                    const room = rooms[jid]
                    return (
                        <ConversationItem key={room.jid} onClick={(e) => onConversationClick(room, e)} active={currentRoom.jid === room.jid} room={room} />
                    )
                })
            }
        </div>
    )
}
