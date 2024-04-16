import { useState } from "react"
import styles from "./MessageInput.module.css"

import { wsClient } from "../../api/wsClient_"
import { useChatStore } from "../../store_"

export function MessageInput() {
    const currentRoom = useChatStore(state => state.currentRoom)

    const [text, setText] = useState('')

    const handleKeyPress = async (e) => {
        if (e.key == 'Enter') {
            setText('')

            const message = await wsClient.sendTextMessage(currentRoom.jid, text) as Record<string, string>
            if (message) {
                // 
            }

        }
    }

    return (
        <div className={styles['massage-input-root']}>
            <div className={styles.tools}></div>
            <div className={styles['input-wrapper']}>
                <input onKeyDown={(e) => handleKeyPress(e)} type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your message here"></input>
            </div>
        </div>
    )
}
