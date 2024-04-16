import { useChatStore } from '../../store_'
import styles from './ChatHeader.module.css'

export function ChatHeader() {
    const currentRoom = useChatStore((state) => state.currentRoom)
    return (
        <div className={styles.header}>
            <div className={styles.content}>
                <div className={styles.title}>{currentRoom.title}</div>
            </div>
        </div>
    )
}