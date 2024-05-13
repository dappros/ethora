import { Box, Container } from "@mui/material"
import ChatAppEmbedded from "../../libs/ChatApp2/components/ChatAppEmbedded"

export function ChatWrapper() {
  return (
    <Container maxWidth="xl" style={{ height: "calc(100vh - 68px)" }}>
        <Box style={{ paddingBlock: "20px", height: "100%" }}>
          <ChatAppEmbedded />
        </Box>
    </Container>
  )
}
