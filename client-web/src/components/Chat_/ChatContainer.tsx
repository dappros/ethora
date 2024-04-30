import { TChatProps } from "."
import { useChatStore } from "../../store_"
import styles from "./ChatContainer.module.css"
import { ChatHeader } from "./ChatHeader"
import { MessageInput } from "./MessageInput"
import { MessageList } from "./MessageList"

export function ChatContainer(props: TChatProps ) {
    const {sendFile} = props

    const messages = useChatStore(state => state.messages)
    const currentRoom = useChatStore(state => state.currentRoom)

    const currentRoomMessages = messages[currentRoom.jid]

    return (
        <div className={styles.container}>
            <ChatHeader />
            <MessageList key={currentRoom.jid} currentRoom={currentRoom} messages={currentRoomMessages} />
            <MessageInput sendFile={sendFile} />
        </div>
    )
}
