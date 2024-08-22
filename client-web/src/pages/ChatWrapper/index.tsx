import { Box, Container } from "@mui/material"
import { ChatAppEmbeded, chatEE } from "../../../comp/dist/main"
import { useHistory, useParams } from "react-router"
import { useEffect } from "react"

export function ChatWrapper() {
  // const params = useParams() as {roomJID: string}
  // const history = useHistory()

  // useEffect(() => {
  //   function onChatOpened () {
  //     const {chatId} = arguments[0]
  //     history.replace(`/chat/${chatId.split("@")[0]}`)
  //   }
  //   chatEE.on("chat-opened", onChatOpened)

  //   return () => {
  //     chatEE.off("chat-opened", onChatOpened)
  //   }
  // }, [])

  // useEffect(() => {
  //   if (params.roomJID !== "none") {
  //     console.log("triggering open-chat event with ", params.roomJID)
  //     chatEE.trigger("open-chat", {localJid: params.roomJID})
  //   }
  // }, [])

  return (
    <Container maxWidth="xl" style={{ height: "calc(100vh - 68px)" }}>
        <Box style={{ paddingBlock: "20px", height: "100%" }}>
          <ChatAppEmbeded />
        </Box>
    </Container>
  )
}
