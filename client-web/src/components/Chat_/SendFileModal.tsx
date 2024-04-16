import { AxiosResponse } from "axios";
import styles from "./SendFileModal.module.css"
import { MdClose } from "react-icons/md";
import { wsClient } from "../../api/wsClient_";

type ModalProps = {
  onClose: () => void,
  file: File,
  sendFile: (formData: FormData) => Promise<AxiosResponse<any, any>>
  roomJid: string
}

export function SendFileModal(props: ModalProps) {
  const {onClose, file, sendFile, roomJid} = props

  const onSend = async () => {
    const fd = new FormData()

    fd.append("files", file)

    try {
      let result =  await sendFile(fd)

      if (result.data.success) {
        const fileOnServer = result.data.results[0]

        wsClient.sendMediaMessage(roomJid, fileOnServer)
      }
    } catch (error) {
      console.log(error)
    }
  }

  console.log(file)

  const renderFilePreview = () => {
    if (file.type.startsWith('image')) {
      return (
        <img className={styles['preview-image']} src={URL.createObjectURL(file)}></img>
      )
    } else {
      return (
        <div>
          {file.name}
        </div>
      )
    }
  }

  const renderTitle = () => {
    if (file.type.startsWith('image')) {
      return (
        "Send Image"
      )
    } else {
      return (
        "Send File"
      )
    }
  }

  return (
    <div className={styles.modal}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span>
            {renderTitle()}
          </span>
          <button onClick={onClose} className={styles['icon-button']}>
            <MdClose size={'25px'}  />
          </button>
        </div>
        <div>
          {
            renderFilePreview()
          }
        </div>
        <div>
          <button onClick={onSend}>Send</button>
        </div>
      </div>
    </div>
  )
}