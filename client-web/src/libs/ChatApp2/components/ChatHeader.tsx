import { ModelChat } from "../models"

import "./ChatHeader.scss"

interface Props {
    chat: ModelChat
}

export function ChatHeader(props: Props) {
    return (
        <div className="ChatHeader">
            <div>
                { props.chat.title }
            </div>
            <div>
                { props.chat.description }
            </div>
        </div>
    )
}
