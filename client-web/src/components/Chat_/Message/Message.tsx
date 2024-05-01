import cn from 'classnames'
import profileImg from '../../../assets/images/profilepic.png'

import "./Message.scss"
import { MoreIcon } from '../Icons/MoreIcon'
import { MessageType } from '../../../store_/chat'

type Props = {
    message: MessageType,
    isGroup: boolean,
    threadMessages: MessageType[] | null
}

export function Message(props: Props) {
    const { message, isGroup, threadMessages } = props

    let replyContent;

    if (threadMessages) {
        const repliesCount = threadMessages.length
        let text = repliesCount === 1 ? `${repliesCount} Reply` : `${repliesCount} Replies`

        replyContent = (
            <div>
                <div>
                    <span>{text}</span>
                </div>

            </div>
        )
    } else {
        replyContent = null
    }

    let content;

    if (message.isSystemMessage === "true") {
        content = (
            <div data-id={message.id} className={cn("chat-message-row", "system")}>
                <span>{message.text}</span>
            </div>
        )
    } else {
        content = (
            <div data-id={message.id} className={cn("chat-message-row", { "me": message.isMe })}>
                <div className="message">
                    <div className="avatar-wrapper">
                        {!isGroup && <img className="avatar" src={profileImg} />}
                    </div>
                    <div className="contentWrapper">
                        <div className="content">
                            <div className="header">
                                {!isGroup && (
                                    <strong>
                                        {`${message.senderFirstName} ${message.senderLastName}`}
                                    </strong>
                                )}
                                <button className="menu-btn">
                                    <MoreIcon />
                                </button>
                            </div>
                            <div>
                                {message.text}
                            </div>
                        </div>
                        {
                            replyContent
                        }

                    </div>
                </div>
            </div>
        )
    }

    return (
        content
    )
}