import { useRef, useEffect, useState } from 'react'
import { useChatStore } from '../../store_'
import { Message } from './Message'

import styles from './MessageList.module.css'
import { wsClient } from '../../api/wsClient_';
import { RoomType } from '../../store_/chat';

interface ScrollParams {
  top: number;
  height: number;
}

type MessageListProps = {
  messages: Record<string, string>[],
  currentRoom: RoomType
}

const loadMoreMessages = async (jid: string, before: string) => {
  const room = useChatStore.getState().rooms[jid]
  const setLoading = useChatStore.getState().setLoading
  const addMessages = useChatStore.getState().addMessages

  if (room.loading || room.allLoaded) {
    console.log('room is loading')
    return
  }

  setLoading(room.jid, true)

  const res = await wsClient.getHistory(room.jid, 40, Number(before)) as Record<string, string>[]
  if (res && res.length) {
    addMessages(room.jid, res)
  }
  setTimeout(() => setLoading(room.jid, false), 1000)
  
}

export function MessageList(props: MessageListProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const currentRoom = props.currentRoom
  const allLoaded = false

  let scrollTimeout = 0;
  const roomMessages = props.messages

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
    const currentRoom = useChatStore.getState().currentRoom
    const messages = useChatStore.getState().messages[currentRoom.jid]
    const params = getScrollParams()
    if (!params) {
      return
    }

    if (params.top < 200 && !allLoaded && !currentRoom.loading) {
      loadMoreMessages(currentRoom.jid, messages[0].id)
    }
  }

  const _onScroll = () => {
    window.clearTimeout(scrollTimeout)
    scrollTimeout = window.setTimeout(() => checkIfLoadMoreMessages(), 100)
  }

  const onScroll = () => {
    checkIfLoadMoreMessages()
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
      content.addEventListener("scroll", _onScroll)
    }

    return () => content.removeEventListener("scroll", _onScroll)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [currentRoom.jid])

  return (
    <>
      <div className={styles.list}>
        {
          roomMessages && roomMessages.length && (
            <>
              {currentRoom.loading && <div className={styles['loading']}>Loading</div>}
              <div ref={contentRef} className={styles.scroll}>
                {
                  roomMessages && roomMessages.map((el) => {
                    return (
                      <Message key={el.id} message={el}></Message>
                    )
                  })
                }
              </div>
            </>
          )
        }
      </div>
    </>
  )
}