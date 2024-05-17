import { actionOpenChat } from "../../actions"
import { ModelChat } from "../../models"
import getChatLastMessage from "../../utils/getChatLastMessage"
import { Ava } from "../Ava/Ava"

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
        let content;
        if (chat.thumbnail === "none") {
            let title = chat.title.split(' ')
            
            if (title.length === 3) {
                title = [title[0], title[2]]
            }
            content = (<Ava name={title.join(' ')} />)
        } else {
            content = (<img src={chat.thumbnail} />)
        }
        return content
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
                {lastMessage && (
                    <div className="ChatListItem__last">
                        {lastMessage.text}
                    </div>
                )}
                {renderUnread()}
            </div>
        </div>
    )
}
