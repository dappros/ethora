
import { ChatListItem } from "./ChatListItem";
import { ModelChat } from "./models";
import { useChatStore } from "./store_";

interface Props {
    chatId: string | null;
    chatList: Array<ModelChat>
}

export function ChatList({chatId, chatList}: Props) {
    return (
        <div>
            {
                chatList.map((chat) => {
                    return (
                        <ChatListItem key={chat.id} selected={chat.id === chatId} chat={chat} />
                    )
                })
            }
        </div>
    )
}
