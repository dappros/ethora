import { Message } from './Message'

import styles from './MessageList.module.css'
import { RoomType } from '../../store_/chat';
import { useEffect, useRef } from 'react';
import { block_scroll, unblock_scroll } from './block_scroll';
import { useChatStore } from '../../store_';

interface ScrollParams {
  top: number;
  height: number;
}

type MessageListProps = {
  messages: Record<string, string>[],
  currentRoom: RoomType
}

export function MessageList(props: MessageListProps) {
  const {currentRoom, messages} = props
  const contentRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef(0)
  const scrollParams = useRef<ScrollParams | null>(null)
  const loadMoreMessages = useChatStore((state) => state.loadMoreMessages)

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

  return (
    <>
      <div><button onClick={() => blockScroll()}>osd</button></div>
      <div className={styles.list} ref={outerRef}>
        <div className={styles.scroll} ref={contentRef}>
          {
            props.messages.map((el) => {
              return (
                <Message key={el.id} message={el}></Message>
              )
            })
          }
        </div>
      </div>
    </>

  )
}