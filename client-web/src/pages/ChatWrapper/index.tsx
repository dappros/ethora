import { Box, Container } from "@mui/material"
import { ChatAppEmbeded } from "../../../comp/dist/main"

export function ChatWrapper() {
  return (
    <Container maxWidth="xl" style={{ height: "calc(100vh - 68px)" }}>
        <Box style={{ paddingBlock: "20px", height: "100%" }}>
          <ChatAppEmbeded />
        </Box>
    </Container>
  )
}
