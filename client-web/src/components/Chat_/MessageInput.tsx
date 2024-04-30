import { useRef, useState } from "react"
import styles from "./MessageInput.module.css"

import { wsClient } from "../../api/wsClient_"
import { useChatStore } from "../../store_"
import { AxiosResponse } from "axios"
import { SendFileModal } from "./SendFileModal"
import { PaperClipIcon } from "./Icons/PaperClipIcon"
import { PaperPlaneIcon } from "./Icons/PaperPlane"

type MessageInputProps = {
  sendFile: (formData: FormData) => Promise<AxiosResponse<any, any>>
}

export function MessageInput(props: MessageInputProps) {
  const { sendFile } = props;

  const [file, setFile] = useState<File>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentRoom = useChatStore(state => state.currentRoom)

  const [text, setText] = useState('')

  const send = async () => {
    setText('')

    const message = await wsClient.sendTextMessage(currentRoom.jid, text) as Record<string, string>
    if (message) {
      // 
    }
  }

  const handleKeyPress = async (e) => {
    if (e.key == 'Enter') {
      send()
    }
  }

  const onFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const onFileChange = async (e) => {
    console.log(e.target.files)
    const file = e.target.files[0]

    if (file) {
      setFile(file)
    }
  }

  return (
    <div className={styles['massage-input-root']}>
      <form style={{ display: 'none' }}>
        <input onChange={onFileChange} type="file" ref={fileInputRef} />
      </form>
      <div className={styles.tools}>
        {
          sendFile && (
            <button className="send-file-btn" onClick={onFile}>
              <PaperClipIcon />
            </button>
          )
        }
      </div>
      <div className={styles['input-wrapper']}>
        <input onKeyDown={(e) => handleKeyPress(e)} type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your message here"></input>
      </div>
      <div className={styles['right-tools']}>
        <button className="send-file-btn" onClick={send}>
          <PaperPlaneIcon />
        </button>
      </div>
      {file &&  <SendFileModal roomJid={currentRoom.jid} file={file} sendFile={sendFile} onClose={() => setFile(null)} />}
    </div>
  )
}
