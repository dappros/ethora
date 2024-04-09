import styles from './ChatHeader.module.css'

export function ChatHeader() {
    return (
        <div className={styles.header}>
            <div className={styles.content}>
                <div className={styles.title}>Title</div>
                <div className={styles.info}>Info</div>
            </div>
        </div>
    )
}