import { Conversation, ConversationList, MainContainer, Search, Sidebar } from "@chatscope/chat-ui-kit-react"
import { Box, Container } from "@mui/material"
import { useEffect } from "react"

type TChatProps = {
  xmppPassword: string,
  walletAddress: string,
  firstName: string,
  lastName: string,
  profileImage: string,
  defaultRooms: string[],
  xmppConnectionUrl: string
}

export function Chat_(props: TChatProps) {
  useEffect(() => {

  }, [])

  return (
    <Container maxWidth="xl" style={{ height: "calc(100vh - 68px)" }}>
      <Box style={{ paddingBlock: "20px", height: "100%" }}>
        <MainContainer responsive>
          <Sidebar position="left" scrollable={false}>
            <Search placeholder="Search..." />
            <ConversationList loading={false}>
              <Conversation
                name="room1"
              >
              </Conversation>
            </ConversationList>
          </Sidebar>
        </MainContainer>
      </Box>
    </Container >
  )
}
