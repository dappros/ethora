import { MessageInput } from "@chatscope/chat-ui-kit-react"
import * as React from "react"

interface CustomMessageInputProperties {
  onPaste: any
  placeholder: string
  onChange: (
    innerHtml: string,
    textContent: string,
    innerText: string,
    nodes: NodeList
  ) => void
  onSend: (
    innerHtml: string,
    textContent: string,
    innerText: string,
    nodes: NodeList
  ) => void
  sendFile: (file: File, isReply: boolean) => void
}

const CustomMessageInput = (properties: CustomMessageInputProperties) => {
  const { onPaste, placeholder, onChange, onSend, sendFile } = properties

  const fileReference = React.useRef(null)

  return (
    <div>
      <MessageInput
        onPaste={onPaste}
        placeholder={placeholder}
        onChange={onChange}
        onSend={onSend}
        onAttachClick={() => fileReference.current.click()}
      />
      <input
        type="file"
        name="file"
        id="file"
        onChange={(event) => sendFile(event.target.files[0], true)}
        ref={fileReference}
        style={{ display: "none" }}
      />
    </div>
  )
}

export default CustomMessageInput
