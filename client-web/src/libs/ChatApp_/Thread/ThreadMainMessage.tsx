import { MessageType } from "../store_/chat"
import profileImg from '../../../assets/images/profilepic.png'

type Props = {
    message: MessageType
}

export const ThreadMainMessage = ({ message }: Props) => {
    return (
        <div className="thread-main-message">
            <div className="thread-message-row">
                <div className="message">
                    <div className="avatar-wrapper">
                        <img className="avatar" src={profileImg} />
                    </div>
                    <div className="contentWrapper">
                        <div className="content">
                            <div className="header">
                                <strong>
                                    {`${message.senderFirstName} ${message.senderLastName}`}
                                </strong>
                            </div>
                            <div>
                                {message.text}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
