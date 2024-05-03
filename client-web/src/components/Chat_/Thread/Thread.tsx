import { useChatStore } from "../../../store_"
import { MessageInput } from "../MessageInput"
import { ThreadHeader } from "./ThreadHeader"
import { ThreadMessages } from "./ThreadMessages"

import "./Thread.scss"
import { MessageType } from "../../../store_/chat"

type Props = {
    currentThreadMessage: MessageType
}

export const Thread = ({currentThreadMessage}: Props) => {
    const currentRoom = useChatStore(state => state.currentRoom)
    const getThreadMessages = useChatStore(state => state.getThreadMessages)
    const threadMessages = getThreadMessages(Number(currentThreadMessage.id))
    return (
        <div className="thread">
            <ThreadHeader currentRoom={currentRoom} />
            <ThreadMessages threadMessages={threadMessages} currentThreadMessage={currentThreadMessage} />
            <MessageInput threadMessages={threadMessages} sendFile={null} />
        </div>
    )
}
