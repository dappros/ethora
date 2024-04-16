import styles from "./ChatContainer.module.css"
import { ChatHeader } from "./ChatHeader"
import { MessageInput } from "./MessageInput"
import { MessageList } from "./MessageList"

export function ChatContainer() {
    return (
        <div className={styles.container}>
            <ChatHeader />
            <MessageList />
            {/* <MessageInput /> */}
        </div>
    )
}
