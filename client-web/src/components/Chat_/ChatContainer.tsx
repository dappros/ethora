import { TChatProps } from "."
import styles from "./ChatContainer.module.css"
import { ChatHeader } from "./ChatHeader"
import { MessageInput } from "./MessageInput"
import { MessageList } from "./MessageList"

export function ChatContainer(props: TChatProps ) {
    const {sendFile} = props
    return (
        <div className={styles.container}>
            <ChatHeader />
            <MessageList />
            <MessageInput sendFile={sendFile} />
        </div>
    )
}
