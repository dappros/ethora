import { ModelChat } from "../models"
import { ChatListItem } from "./ChatListItem/ChatListItem"

import "./ChatList.scss"

interface Props {
    chatList: Array<ModelChat>,
    chatId: string
}

export default function ChatList(props: Props) {
    return (
        <div className="ChatList">
            {
                props.chatList.map((chat) => {
                    const id = chat.id
                    const selected = (id === props.chatId)
                    return (
                        <ChatListItem
                            chat={chat}
                            selected={selected}
                            key={id}
                        />
                    )
                })
            }
        </div>
    )
}