import cn from 'classnames'
import profileImg from '../../../assets/images/profilepic.png'

import "./Message.scss"
import { MoreIcon } from '../Icons/MoreIcon'

export function Message(props) {
    const {message, isGroup} = props
    return (
        <div data-id={message.id} className={cn("chat-message-row", {"me": message.isMe})}>
            <div className="message">
                <div className="avatar-wrapper">
                    { !isGroup &&  <img className="avatar" src={profileImg} /> }
                </div>
                <div className="contentWrapper">
                    <div className="content">
                        <div className="header">
                            { !isGroup && (
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
                </div>
            </div>
        </div>
    )
}