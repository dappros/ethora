import { TChatProps } from "."
import { useChatStore } from "../../store_"
import { ChatHeader } from "./ChatHeader"
import { MessageInput } from "./MessageInput"
import { MessageList } from "./MessageList"
import { Thread } from "./Thread/Thread"

export function ChatContainer(props: TChatProps) {
    const { sendFile } = props

    const messages = useChatStore(state => state.messages)
    const currentRoom = useChatStore(state => state.currentRoom)
    const currentThreadMessage = useChatStore(state => state.currentThreadMessage)

    const currentRoomMessages = messages[currentRoom.jid]

    return (
        <div className="chat">
            <div className="chat-middle">
                <ChatHeader />
                <MessageList key={currentRoom.jid} currentRoom={currentRoom} messages={currentRoomMessages} />
                <MessageInput sendFile={sendFile} />
            </div>
            {currentThreadMessage && (
                <div className="chat-right">
                    <Thread currentThreadMessage={currentThreadMessage} />
                </div>
            )}
        </div>
    )
}
