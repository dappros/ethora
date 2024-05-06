import cn from "classnames"
import { Menu, Transition } from '@headlessui/react'

import styles from "./ConversationItem.module.css"

export function ConversationItem(props) {
    const onContextMenu = (e) => {
        e.preventDefault()
    }

    return (
        <div onContextMenu={onContextMenu} className={cn(styles.conversation, {[styles.active]: props.active})} onClick={props.onClick}>
            <div className={styles.avatar}>
                <img src={props.room.room_thumbnail}></img>
            </div>
            <div className={styles.content}>
                <div className={styles.name}>
                    {props.room.title}
                </div>
                <div className={styles.info}>
                    {props.room.recentMessage?.text}
                </div>
            </div>
            <div className={styles.activity}>16:00</div>
        </div>
    )
}
