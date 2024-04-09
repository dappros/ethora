import styles from './ChatSidebar.module.css'

export default function ChatSidebar(props) {
    return (
        <div className={styles.sidebar}>{props.children}</div>
    )
}