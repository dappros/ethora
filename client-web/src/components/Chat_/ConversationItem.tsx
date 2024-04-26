import cn from "classnames"

import styles from "./ConversationItem.module.css"

export function ConversationItem(props) {
    return (
        <div className={cn(styles.conversation, {[styles.active]: props.active})} onClick={props.onClick}>
            <div className={styles.avatar}>
                <img src={props.room.room_thumbnail}></img>
            </div>
            <div className={styles.content}>
                <div className={styles.name}>
                    {props.room.title}
                </div>
                {/* <div className={styles.info}>
                    {props.room.recentMessage?.text}
                </div> */}
                <div className={styles.info}>
                    {props.room.loading.toString()}
                </div>
            </div>
            <div className={styles.activity}>16:00</div>
        </div>
    )
}