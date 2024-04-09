import styles from './ChatMainContainer.module.css'

export function ChatMainContainer(props) {
    return (
        <div className={styles.container}>
            {props.children}
        </div>
    )
}
