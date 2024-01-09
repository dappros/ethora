import { useState } from "react"
import xmppService from "../XmppService"

export function RoomConfig(props) {
    const [roomLocalPart, setRoomLocalPart] = useState('')
    const [roomConfig, setRoomConfig] = useState({})

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const getRoomConfig = async () => {
        try {
            const result = await xmppService.getConfiguration(roomLocalPart)
            setRoomConfig(result)
        } catch (e) {}
    }

    const saveRoomConfig = async () => {
        try {
            console.log('here ', roomLocalPart)
            await xmppService.saveRoomConfig(roomLocalPart, name, description)
        } catch (e) {}
    }

    return (
        <div {...props}>
            <h4>Room Config Component</h4>
            <div>
                <input placeholder="room local part" value={roomLocalPart} onChange={(e) => setRoomLocalPart(e.target.value)}></input>
                <button onClick={getRoomConfig}>Get Config</button>
                <div>
                    Result:
                    {JSON.stringify(roomConfig)}
                </div>
            </div>
            <div>
                <h4>Set Room Config</h4>
                <input placeholder="room name" onChange={(e) => setName(e.target.value)}></input>
                <input placeholder="room desc" onChange={(e) => setDescription(e.target.value)}></input>
                <button onClick={saveRoomConfig}>Save</button>
            </div>
        </div>
    )
}