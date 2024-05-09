import * as React from 'react'
import { Message } from '../Message/Message'

import { MessageType } from '../store_/chat';
import { useEffect, useRef } from 'react';
import { ChatDateDevider } from '../ChatDateDevider';
import { ThreadMainMessage } from './ThreadMainMessage';

const isTheSameDay = (date1: Date, date2: Date) => {
  return (
    (date1.getDate() === date2.getDate()) &&
    (date1.getMonth() === date2.getMonth()) &&
    (date1.getFullYear() === date2.getFullYear())
  );
}

type Props = {
  threadMessages: MessageType[] | null
  currentThreadMessage: MessageType
}

export function ThreadMessages(props: Props) {
  const messages = props.threadMessages
  const currentThreadMessage = props.currentThreadMessage
  const contentRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)


  const scrollToBottom = (): void => {
    const content = contentRef.current;
    if (content) {
      const height = content.clientHeight;
      const scroll_height = content.scrollHeight;

      if (scroll_height > height) {
        content.scrollTop = scroll_height - height;
      }
    }
  }

  const isMessageFirstOfDate = (message: MessageType, index: number) => {
    return index === 0 || !isTheSameDay(new Date(Number(message.created)), new Date(Number(messages[index - 1].created)));
  }

  useEffect(() => {
    scrollToBottom()
  }, [])

  const isGroup = (message, index) => {
    if (index === 0 || message.isSystemMessage === "true") {
      return false
    }

    const prevMessage = props.threadMessages[index - 1]

    if (prevMessage.from !== message.from || prevMessage.isSystemMessage === "true") {
      return false
    }

    return true
  }

  return (
    <div className={"list"} ref={outerRef}>
      <div className={"scroll"} ref={contentRef}>
        <ThreadMainMessage message={currentThreadMessage} />
        {
          props.threadMessages && props.threadMessages.map((message, index) => {

            return (
              <React.Fragment key={message.id}>
                {isMessageFirstOfDate(message, index) && (
                  <ChatDateDevider key={message.created} date={message.created} />
                )}
                <Message showActions={false} isGroup={isGroup(message, index)} message={message} threadMessages={null}></Message>
              </React.Fragment>
            )
          })
        }
      </div>
    </div>
  )
}
