import { actionOpenChat } from "../../actions"
import { ModelChat } from "../../models"
import getChatLastMessage from "../../utils/getChatLastMessage"

import './ChatListItem.scss'

interface Props {
    chat: ModelChat,
    selected: boolean
}

export function ChatListItem({chat, selected}: Props) {
    const lastMessage = getChatLastMessage(chat)
    let className = 'ChatListItem'

    if (selected) {
        className += ' ChatListItem_selected'
    }

    const renderThumb = () => {
        return chat.thumbnail === "none" ? null : <img src={chat.thumbnail} />
    }

    const renderUnread = () => {
        if (chat.hasUnread) {
            return (
                <span className="ChatListItem__unread"/>
            )
        }
    }

    const onClick = () => {
        actionOpenChat(chat.id)
    }

    return (
        <div className={className} onClick={onClick}>
            <div className="ChatListItem__left">
                {renderThumb()}
            </div>
            <div className="ChatListItem__right">
                <div className="ChatListItem__title">
                    { chat.title }
                </div>
                <div className="ChatListItem__last">
                    {lastMessage.text}
                </div>
                {renderUnread()}
            </div>
        </div>
    )
}
