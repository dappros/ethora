import { ModelChatMessage } from "../../models"
import "./ChatMessage.scss"

interface Props {
    message: ModelChatMessage
}

export function ChatMessage({message}: Props) {
    const hasSatus = (): boolean => {
        const {status, isMe} = message

        const isFailed = status === 'failed'
        const isQueued = status === 'queued'

        return !isFailed && isMe && isQueued
    }

    const isFailed = (): boolean => {
        return message.status === 'failed' ? true : false
    }

    return (
        <div className="ChatMessage">
            {message.text}
        </div>
    )
}
