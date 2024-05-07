import { useChatStore } from "../../../store_"
import { MessageInput } from "../MessageInput"
import { ThreadHeader } from "./ThreadHeader"
import { ThreadMessages } from "./ThreadMessages"

import "./Thread.scss"
import { MessageType } from "../../../store_/chat"

type Props = {
    currentThreadMessage?: MessageType
}

export const Thread = ({ currentThreadMessage }: Props) => {
    const currentRoom = useChatStore(state => state.currentRoom)

    let content

    const threadsMessages = useChatStore(state => state.threadsMessages)
    const _threadMessages = threadsMessages[Number(currentThreadMessage.id)] || null

    content = (
        <div className="thread">
            <ThreadHeader currentRoom={currentRoom} />
            <ThreadMessages threadMessages={_threadMessages} currentThreadMessage={currentThreadMessage} />
            <MessageInput mainMessage={currentThreadMessage} sendFile={null} />
        </div>
    )

    return content
}
