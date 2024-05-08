import * as React from 'react'
import { Message } from './Message/Message'

import styles from './MessageList.module.css'
import { MessageType, RoomType } from '../../store_/chat';
import { useEffect, useRef } from 'react';
import { block_scroll } from './block_scroll';
import { useChatStore } from '../../store_';
import { ChatDateDevider } from './ChatDateDevider';

interface ScrollParams {
  top: number;
  height: number;
}

type MessageListProps = {
  messages: MessageType[],
  currentRoom: RoomType
}

const isTheSameDay = (date1: Date, date2: Date) => {
    return (
        (date1.getDate() === date2.getDate()) &&
        (date1.getMonth() === date2.getMonth()) &&
        (date1.getFullYear() === date2.getFullYear())
    );
}

export function MessageList(props: MessageListProps) {
  const {currentRoom, messages} = props
  const contentRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef(0)
  const scrollParams = useRef<ScrollParams | null>(null)
  const loadMoreMessages = useChatStore((state) => state.loadMoreMessages)
  const threadMessages = useChatStore((state) => state.threadsMessages)

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

  const getScrollParams = (): ScrollParams | null => {
    const content = contentRef.current;
    if (!content) {
      return null;
    }

    return {
      top: content.scrollTop,
      height: content.scrollHeight,
    };
  }

  const blockScroll = () => {
    const content = contentRef.current;
    if (content) {
      block_scroll(content);
    }
  }

  const checkIfLoadMoreMessages = () => {
    const params = getScrollParams()

    if (!params) {
      return;
    }

    if (params.top < 100 && !currentRoom.allLoaded) {
      scrollParams.current = getScrollParams()
      loadMoreMessages(currentRoom.jid)
    }
  }

  const onScroll = () => {
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => checkIfLoadMoreMessages(), 50);
  }

  const isMessageFirstOfDate = (message: MessageType, index: number) => {
    return index === 0 || !isTheSameDay(new Date(Number(message.created)), new Date(Number(messages[index - 1].created)));
  }

  useEffect(() => {
    scrollToBottom()
    blockScroll()

    const messagesOuter = outerRef.current

    if (messagesOuter) {
      messagesOuter.addEventListener('scroll', onScroll, true);
    }

    return () => {
      messagesOuter.removeEventListener('scroll', onScroll, true);
    }
  }, [])

  useEffect(() => {
    if (messages && messages.length > 30) {
      if (scrollParams.current) {
        const _scrollParams = getScrollParams();

        if (_scrollParams && contentRef.current) {
          const scrollTop = scrollParams.current.top + (_scrollParams.height - scrollParams.current.height);
          contentRef.current.scrollTop = scrollTop;
        }

        scrollParams.current = null;
      }
    }
  }, [messages])

  useEffect(() => {
    if (messages) {
      if (messages[messages.length - 1].isMe) {
        scrollToBottom()
      }
    }
  }, [messages])

  const isGroup = (message, index) => {
    if (index === 0 || message.isSystemMessage === "true") {
      return false
    }

    const prevMessage = messages[index - 1]

    if (prevMessage.from !== message.from || prevMessage.isSystemMessage === "true") {
      return false
    }

    return true
  }

  return (
    <>
      <div className={styles.list} ref={outerRef}>
        <div className={styles.scroll} ref={contentRef}>
          {
            messages && messages.map((message, index) => {
              let _threadMessages = threadMessages[Number(message.id)]

              return (
                <React.Fragment key={message.id}>
                  { isMessageFirstOfDate(message, index) && (
                    <ChatDateDevider key={message.created} date={message.created} />
                  ) }
                  <Message key={message.id} isGroup={isGroup(message, index)} message={message} threadMessages={_threadMessages}></Message>
                </React.Fragment>
              )
            })
          }
        </div>
      </div>
    </>
  )
}
