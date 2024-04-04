import { Avatar, Conversation, ConversationList, MainContainer, Search, Sidebar } from "@chatscope/chat-ui-kit-react"
import { Box, Container } from "@mui/material"
import { useEffect } from "react"
import { wsClient } from "../../api/wsClient_"
import { RoomType } from "../../store_/chat"
import { useChatStore } from "../../store_"

type TChatProps = {
  xmppPassword: string,
  xmppUsername: string,
  walletAddress?: string,
  firstName: string,
  lastName: string,
  profileImage: string,
  initRooms: string[],
  xmppService: string,
  isRestrictedToInitRooms: boolean,
}

export function Chat_(props: TChatProps) {
  const { xmppService, xmppPassword, xmppUsername, initRooms, isRestrictedToInitRooms } = props
  const setTooms = useChatStore(state => state.setRooms)
  const setCurrentRoom = useChatStore(state => state.setCurrentRoom)
  const rooms = useChatStore(state => state.rooms)
  const currentRoom = useChatStore(state => state.currentRoom)

  useEffect(() => {
    console.log('mounted')
  }, [])

  useEffect(() => {
    (async () => {
      console.log('init')
      wsClient.init(xmppService, xmppUsername, xmppPassword)
      try {
        await wsClient.connect()
        console.log('online')
        let rooms = await wsClient.getRooms()

        if (!rooms) {
          rooms = await wsClient.getRooms()
        }

        if (isRestrictedToInitRooms) {
          rooms = rooms.filter((el => {
            return initRooms.includes(el.jid)
          }))
        }

        await wsClient.presence(rooms.map(el => el.jid))
        const recentMesssages = []

        for (const room of rooms) {
          const recentMsg = await wsClient.getHistory(room.jid, 1)

          if (recentMsg && recentMsg[0]) {
            recentMesssages.push(recentMsg[0])
          }
        }

        let roomsForState: RoomType[] = rooms.map((el, index) => {
          return {
            jid: el.jid,
            title: el.name,
            usersCnt: el.users_cnt,
            roomBackground: el.room_background,
            room_thumbnail: el.room_thumbnail,
            groupName: '',
            newMessagesCount: 0,
            recentMessage: recentMesssages[index]
          }
        })

        setTooms(roomsForState)
        setCurrentRoom(roomsForState[0])
      } catch (e) {
        console.log("=-> xmpp connection error")
        console.log(e)
      }
    })()
  }, [])

  const onConversationClick = (index: number) => {
    setCurrentRoom(rooms[index])
  }

  return (
    <Container maxWidth="xl" style={{ height: "calc(100vh - 68px)" }}>
      <Box style={{ paddingBlock: "20px", height: "100%" }}>
        <MainContainer responsive>
          <Sidebar position="left" scrollable={false}>
            <Search placeholder="Search..." />
            <ConversationList loading={false}>
              {
                rooms.map((el, index) => (
                  <Conversation
                    active={currentRoom.jid === el.jid}
                    key={el.jid}
                    name={el.title}
                    info={el.recentMessage.text}
                    onClick={() => onConversationClick(index)}
                    unreadCnt={1}
                    lastActivityTime={1}
                  >
                    <Avatar
                      src={
                        el.room_thumbnail === "none"
                          ? "https://icotar.com/initials/" + el.title
                          : el.room_thumbnail
                      }
                    />
                  </Conversation>
                ))
              }
            </ConversationList>
          </Sidebar>
        </MainContainer>
      </Box>
    </Container >
  )
}
