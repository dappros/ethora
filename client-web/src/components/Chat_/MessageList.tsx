import styles from './MessageList.module.css'

export function MessageList() {
    return (
        <div className={styles.list}>
            <div className={styles.scroll}>
                Message List
            </div>
        </div>
    )
}