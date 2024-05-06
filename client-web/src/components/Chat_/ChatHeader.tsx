import { useChatStore } from '../../store_'
import { Dialog } from "@headlessui/react"

import './ChatHeader.scss'
import { useState } from 'react'

export function ChatHeader() {
    const currentRoom = useChatStore((state) => state.currentRoom)

    const [showLeaveModal, setShowLeaveModal] = useState(false)

    return (
        <div className={"room-header"}>
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
                </Dialog.Panel>
            </Dialog>
        </div>
    )
}