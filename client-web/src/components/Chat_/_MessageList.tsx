import { useEffect, useRef } from 'react'
import { Message } from './Message'

import styles from './MessageList.module.css'
import { RoomType } from '../../store_/chat';

type MessageListProps = {
  messages: Record<string, string>[],
  currentRoom: RoomType
}

export function MessageList(props: MessageListProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const roomMessages = props.messages

  useEffect(() => {
    const content = contentRef.current
    if (!content) {
      return
    }

    const onScroll = () => {
      console.log('onScroll')
    }

    content.addEventListener("scroll", onScroll)

    return () => content.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <div className={styles.list}>
        {
          roomMessages && roomMessages.length && (
            <>
              <div className={styles.scroll} ref={contentRef}>
                <div>
                  {
                    roomMessages && roomMessages.map((el) => {
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
      </div>
    </>
  )
}