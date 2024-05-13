import { ModelChat } from "../models"

interface Props {
    chat: ModelChat
}

export default function ChatMessages(props: Props) {
    console.log('ChatMessages prosp ', props)
    return (
        <div>ChatMessages</div>
    )
}