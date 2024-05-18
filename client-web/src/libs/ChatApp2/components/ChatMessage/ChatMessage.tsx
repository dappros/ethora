import { ModelChatMessage } from "../../models"
import cn from "classnames"

import "./ChatMessage.scss"
import { Ava } from "../Ava/Ava"
import { Emoji } from "../Emoji/Emoji"

interface Props {
    message: ModelChatMessage
    isGroup: boolean
}

export function ChatMessage({message, isGroup}: Props) {
    const hasSatus = (): boolean => {
        const {status, isMe} = message

        const isFailed = status === 'failed'
        const isQueued = status === 'queued'

        return !isFailed && isMe && isQueued
    }

    const isFailed = (): boolean => {
        return message.status === 'failed' ? true : false
    }

    const isSystem = (): boolean => {
        return message.dataAttrs.isSystemMessage === "true"
    }

    const renderStatus = () => {
        const { status } = message;

        if (!hasSatus()) {
            return
        }

        let class_name = 'ChatMessage__status';

        if (status === 'queued') {
            class_name += ' ChatMessage__status_queued';
        }

        return (
            <span className={ class_name }/>
        )
    }

    const renderEmojies = () => {
        let emojies;
        if (message.emojis && message.emojis.length) {
            emojies = message.emojis.map((code, index) => {
                return (
                    <Emoji key={`${code}${index}`} code={code} />
                )
            })
        }

        return (
            <div className="Emoji__row">
                {emojies}
            </div>
        )
    }

    let content;

    if (message.dataAttrs.isSystemMessage === "true") {
        content = (
            <div className="Message__system">
                {message.text}
            </div>
        )
    } else {
        content = (
            <div className="Message__container_outer">
                { !isGroup && (
                    <div className="Message__avatar">
                        <Ava name={`${message.dataAttrs.senderFirstName} ${message.dataAttrs.senderLastName}`}></Ava>
                    </div>
                ) }
                <div className="Message__container">
                    {!isGroup && (<div>{ `${message.dataAttrs.senderFirstName} ${message.dataAttrs.senderLastName}` }</div>)}
                    {message.text}
                    {renderStatus()}
                    {renderEmojies()}
                </div>

            </div>
        )
    }

    return (
        <div className={cn("ChatMessage", {"ChatMessage_sent": (message.isMe && !isSystem()), "ChatMessage_received": (!message.isMe && !isSystem())})}>
            { content }
        </div>
    )
}
