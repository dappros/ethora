import { useRef, useEffect, useState } from 'react'
import { useChatStore } from '../../store_'
import { Message } from './Message'

import styles from './MessageList.module.css'
import { wsClient } from '../../api/wsClient_';

interface ScrollParams {
  top: number;
  height: number;
}

type MessageListProps = {
  messages: Record<string, string>[]
}

export function MessageList(props: MessageListProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const currentRoom = useChatStore(state => state.currentRoom)
  const rooms = useChatStore(state => state.rooms)
  const addMessages = useChatStore(state => state.addMessages)
  const allLoaded = false

  let scrollTimeout = 0;

  const roomMessages = props.messages

  const loadMoreMessages = async (jid: string, before: string) => {
    const room = rooms.find((el => el.jid === jid))

    if (room.loading || room.allLoaded) {
      return
    }

    const res = await wsClient.getHistory(room.jid, 10, Number(before))
    addMessages(room.jid, res as Record<string, string>[])
  }

  const getScrollParams = (): ScrollParams | null => {
    const content = contentRef.current
    if (!content) {
      return null
    }

    return {
      top: content.scrollTop,
      height: content.scrollHeight
    }
  }

  const checkIfLoadMoreMessages = (): void => {
    const messages = useChatStore.getState().messages[currentRoom.jid]
    const params = getScrollParams()
    if (!params) {
      return
    }

    if (params.top < 100 && !allLoaded) {
      console.log('loading more... ', currentRoom.jid, messages[0].id)
      loadMoreMessages(currentRoom.jid, messages[0].id)
    }
  }

  const onScroll = () => {
    window.clearTimeout(scrollTimeout)
    scrollTimeout = window.setTimeout(() => checkIfLoadMoreMessages(), 50)
  }

  const scrollToBottom = () => {
    const content = contentRef.current
    if (content) {
      const height = content.clientHeight
      const scrollHeight = content.scrollHeight

      if (scrollHeight > height) {
        content.scrollTop = scrollHeight - height
      }
    }

  }

  useEffect(() => {
    const content = contentRef.current
    if (content) {
      content.addEventListener("scroll", onScroll)
    }

    return () => content.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [currentRoom])

  return (
    <div className={styles.list}>
        {
          roomMessages && roomMessages.length && (
            <div ref={contentRef} className={styles.scroll}>
              {
                roomMessages && roomMessages.map((el) => {
                  return (
                    <Message key={el.id} message={el}></Message>
                  )
                })
              }
            </div>
          )
        }
    </div>
  )
}