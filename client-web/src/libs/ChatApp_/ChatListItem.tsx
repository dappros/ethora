import cn from "classnames"

import styles from "./ChatListItem.module.css"
import { ModelChat } from "./models";
import { useChatStore } from "./store_";
import getChatLastMessage from "./utils/getChatLastMessage";

interface Props {
    selected: boolean;
    chat: ModelChat
}

export function ChatListItem({chat, selected}: Props) {
    const doOpenChat = useChatStore(state => state.doOpenChat)
    const lastMessage = getChatLastMessage(chat)

    let avatar

    if (chat.room_thumbnail !== 'none') {
        avatar = <img src={chat.room_thumbnail}></img>
    } else {
        avatar = null
    }

    const onClick = () => {
        doOpenChat(chat.id)
    }

    return (
        <div className={cn(styles.conversation, {[styles.active]: selected})} onClick={onClick}>
            <div className={styles.avatar}>
                { avatar }
            </div>
            <div className={styles.content}>
                <div className={styles.name}>
                    {chat.title}
                </div>
                <div className={styles.info}>
                    {lastMessage.text}
                </div>
            </div>
        </div>
    )
}
