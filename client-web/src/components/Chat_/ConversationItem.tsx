import cn from "classnames"
import { Menu, Transition } from '@headlessui/react'

import styles from "./ConversationItem.module.css"

export function ConversationItem(props) {
    const onContextMenu = (e) => {
        e.preventDefault()
    }

    let avatar

    if (props.room.room_thumbnail !== 'none') {
        avatar = <img src={props.room.room_thumbnail}></img>
    } else {
        avatar = null
    }

    return (
        <div onContextMenu={onContextMenu} className={cn(styles.conversation, {[styles.active]: props.active})} onClick={props.onClick}>
            <div className={styles.avatar}>
                { avatar }
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
