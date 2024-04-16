import { useRef, useEffect, useState } from 'react'
import { useChatStore } from '../../store_'
import { Message } from './Message'

import styles from './MessageList.module.css'

export function MessageList() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const messages = useChatStore(state => state.messages)
  const currentRoom = useChatStore(state => state.currentRoom)

  const [scrollTop, setScrollTop] = useState(0)

  const roomMessages = messages[currentRoom?.jid]

  useEffect(() => {
    const scrollElement = scrollRef.current

    if (!scrollElement) {
      return
    }

    const handleScroll = () => {
      setScrollTop(scrollElement.scrollTop)

      if (scrollElement.scrollTop < 100) {
        // console.log("scrollElement.scrollTop < 100")
      }
    }

    handleScroll()

    scrollElement.addEventListener("scroll", handleScroll)

    return () => scrollElement.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const scrollEl = scrollRef.current

    if (!scrollEl) {
      return
    }

    const handleScrollToBottom = () => {
      const scrollHeight = scrollEl.scrollHeight

      scrollEl.scrollTop = scrollHeight
    }

    handleScrollToBottom()
  }, [roomMessages])

  return (
    <div className={styles.list}>
      {
        roomMessages && roomMessages.length && (
          <div ref={scrollRef} className={styles.scroll}>
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