import { useChatStore } from "../store_"
import { MessageInput } from "../MessageInput"
import { ThreadHeader } from "./ThreadHeader"
import { ThreadMessages } from "./ThreadMessages"

import "./Thread.scss"
import { MessageType } from "../store_/chat"
import { useState } from "react"

type Props = {
    currentThreadMessage?: MessageType
}

export const Thread = ({ currentThreadMessage }: Props) => {
    const currentRoom = useChatStore(state => state.currentRoom)
    const [shouldSendToTheRoom, setShouldSendToTheRoom] = useState(false)

    let content

    const threadsMessages = useChatStore(state => state.threadsMessages)
    const _threadMessages = threadsMessages[Number(currentThreadMessage.id)] || null

    content = (
        <div className="thread">
            <ThreadHeader currentRoom={currentRoom} />
            <ThreadMessages threadMessages={_threadMessages} currentThreadMessage={currentThreadMessage} />
            <div style={{padding: "10px"}}>
                <input
                    type="checkbox" 
                    onChange={() => setShouldSendToTheRoom(!shouldSendToTheRoom)} 
                    id="scales" 
                    name="scales" 
                    checked={shouldSendToTheRoom} 
                />
                <label htmlFor="scales">Also send to the room</label>
            </div>
            <MessageInput mainMessage={currentThreadMessage} shouldSendToTheRoom={shouldSendToTheRoom} sendFile={null} />
        </div>
    )

    return content
}
