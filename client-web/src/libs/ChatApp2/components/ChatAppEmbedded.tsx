import { useEffect } from "react"
import { useChatStore } from "../store/useChatStore"
import getChat from "../utils/getChat"
import ChatList from "./ChatList"
import ChatMessages from "./ChatMessages"
import ChatInput from "./ChatInput/ChatInput"

export default function ChatAppEmbeded() {
    const inited = useChatStore(state => state.inited)
    const chatId = useChatStore(state => state.chatId)
    const chatList = useChatStore(state => state.chatList)

    return (
        <div>
            <div>ChatAppEmbeded</div>
            {!inited ?
                (<div>loading...</div>) :
                (
                    <div>
                        <ChatList chatId={chatId} chatList={chatList} />
                        <div>
                            <ChatMessages chat={getChat(chatList, chatId)} />
                            <ChatInput chat={getChat(chatList, chatId)} chatId={chatId} />
                        </div>
                    </div>
                )
            }
        </div>
    )
}