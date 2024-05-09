import { useChatStore } from './store_'
import { Dialog } from "@headlessui/react"

import './ChatHeader.scss'
import { useState } from 'react'
import { wsClient } from './wsClient_'

export function ChatHeader() {
    const currentRoom = useChatStore((state) => state.currentRoom)
    const leaveCurrentRoom = useChatStore((state) => state.leaveCurrentRoom)

    const [showLeaveModal, setShowLeaveModal] = useState(false)

    const onLeave = () => {
        wsClient.leaveTheRoom(currentRoom.jid)
        leaveCurrentRoom()
        setShowLeaveModal(false)
    }

    return (
        <div className={"room-header"} data-jid={currentRoom.jid}>
            <div className={"content"}>
                <div className={"title"}>{currentRoom.title}</div>

            </div>
            <div className="room-header-tools">
                <button onClick={() => setShowLeaveModal(true)}>leave</button>
            </div>

            <Dialog className="file-dialog" open={showLeaveModal} onClose={() => setShowLeaveModal(false)}>
                <Dialog.Panel className="inner">
                    <p>
                        Are you shoure
                    </p>
                    <p>
                        <button onClick={onLeave}>Leave</button>
                        <button>Cancel</button>
                    </p>
                </Dialog.Panel>
            </Dialog>
        </div>
    )
}