import { useEffect } from "react"
import { useChatStore } from "../store/useChatStore"

export default function ChatAppEmbeded() {
    const inited = useChatStore(state => state.inited)
    const chatId = useChatStore(state => state.chatId)
    const chatList = useChatStore(state => state.chatList)

    useEffect(() => {
        if (inited) {
            console.log(chatId)
        }
    }, [inited, chatId])

    return (
        <div>
            <div>ChatAppEmbeded</div>
            {!inited ?
                (<div>loading...</div>) :
                (
                    <div>
                        content
                    </div>
                )
            }
        </div>
    )
}