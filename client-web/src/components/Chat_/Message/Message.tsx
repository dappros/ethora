import cn from 'classnames'
import profileImg from '../../../assets/images/profilepic.png'

import "./Message.scss"
import { MoreIcon } from '../Icons/MoreIcon'
import { MessageType } from '../../../store_/chat'
import { useChatStore } from '../../../store_'
import { DateTime } from 'luxon'
import { Dialog } from '@headlessui/react'
import { useState } from 'react'
import { wsClient } from '../../../api/wsClient_'

type Props = {
    message: MessageType,
    isGroup: boolean,
    threadMessages: MessageType[] | null
    showActions?: boolean
}

export function Message(props: Props) {
    const { message, isGroup, threadMessages, showActions = 'true' } = props
    const setCurrentThreadMessage = useChatStore(state => state.setCurrentThreadMessage)
    const deleteMessage = useChatStore(state => state.deleteMessage)
    const setEditMessage = useChatStore(state => state.setEditMessage)

    const [showMeDialog, setShowMeDialog] = useState(false)
    const [showOtherDialog, setShowOtherDialog] = useState(false)

    const onThreadInfClick = () => {
        setCurrentThreadMessage(message)
    }

    const onEdit = () => {
        setEditMessage(message)
        setShowMeDialog(false)
    }

    const onMessageMenuClick = () => {
        if (message.isMe) {
            setShowMeDialog(true)
        } else {
            setShowOtherDialog(true)
        }
    }

    const onReply = () => {
        setCurrentThreadMessage(message)
        setShowMeDialog(false)
        setShowOtherDialog(false)
    }

    const onBlock = () => {
        const localUserJid = message.from.split('/')[1]
        wsClient.blockUser(`${localUserJid}`)
    }

    const onDelete = () => {
        const roomJid = message.from.split('/')[0]
        wsClient.deleteMessage(roomJid, message.id)
        deleteMessage(roomJid, message.id)
        setShowMeDialog(false)
    }

    const onGetBlockList = () => {
        wsClient.getBlockList()
    }

    let threadInfContent;

    if (threadMessages) {
        const repliesCount = threadMessages.length
        let text = repliesCount === 1 ? `${repliesCount} Reply` : `${repliesCount} Replies`

        threadInfContent = (
            <div className='thread-inf-content' onClick={onThreadInfClick}>
                <div>
                    <span>{text}</span>
                </div>

            </div>
        )
    } else {
        threadInfContent = null
    }

    let content;

    if (message.isSystemMessage === "true") {
        content = (
            <div data-id={message.id} className={cn("chat-message-row", "system")}>
                <span>{message.text}</span>
            </div>
        )
    } else {
        let messagePayload;

        if (message.isMediafile === "true" && !message.locationPreview) {
            content = null
        }

        if (message.isMediafile === "true" && message.locationPreview) {
            messagePayload = <img className="message-image" src={message.locationPreview}></img>
        } else {
            messagePayload = message.text
        }

        content = (
            <div data-id={message.id} data-isme={message.isMe} className={cn("chat-message-row", { "me": message.isMe })}>
                <div className="message">
                    <div className="avatar-wrapper">
                        {!isGroup && <img className="avatar" src={profileImg} />}
                    </div>
                    <div className="contentWrapper">
                        <div className="content">
                            { (message.mainMessage && !showActions) && (
                                <div style={{marginLeft: '10px', color: "rgb(32, 105, 223"}}>
                                    <div>{message.mainMessage.userName}</div>
                                    <div>{message.mainMessage.text}</div>
                                </div>
                            ) }
                            <div className="header">
                                {!isGroup && (
                                    <strong>
                                        {`${message.senderFirstName} ${message.senderLastName}`}
                                    </strong>
                                )}
                                {showActions && (
                                    <button className="menu-btn" onClick={onMessageMenuClick}>
                                        <MoreIcon />
                                    </button>
                                )}
                            </div>
                            <div>
                                {messagePayload}
                            </div>
                            <div className='message-date'>{DateTime.fromMillis(Number(message.created)).toFormat('dd.LL hh:mm a')}</div>
                        </div>
                        {
                            threadInfContent
                        }
                    </div>
                </div>
                <Dialog className="file-dialog" open={showMeDialog} onClose={() => setShowMeDialog(false)}>
                    <Dialog.Panel className="inner">
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div>
                                <button onClick={onReply}>Reply</button>
                            </div>
                            <div>
                                <button onClick={onEdit}>Edit</button>
                            </div>
                            <div>
                                <button onClick={onDelete}>Delte</button>
                            </div>
                        </div>

                    </Dialog.Panel>
                </Dialog>
                <Dialog className="file-dialog" open={showOtherDialog} onClose={() => setShowOtherDialog(false)}>
                    <Dialog.Panel className="inner">
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div>
                                <div>
                                    <button onClick={onReply}>Reply</button>
                                </div>
                                <div>
                                    <button onClick={onBlock}>Block</button>
                                </div>
                            </div>
                        </div>
                    </Dialog.Panel>
                </Dialog>

            </div>


        )
    }

    return (
        content
    )
}