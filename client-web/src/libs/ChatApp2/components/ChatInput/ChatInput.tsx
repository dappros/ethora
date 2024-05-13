import { ModelChat } from "../../models"

interface Props {
    chatId: string,
    chat: ModelChat,
}

export default function ChatInput(props: Props) {
    console.log('ChatInput props ', props)
    return (
        <div>ChatInput</div>
    )
}
