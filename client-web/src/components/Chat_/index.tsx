import { Box, Container } from "@mui/material"
import { useEffect, useState } from "react"
import { wsClient } from "../../api/wsClient_"
import { RoomType } from "../../store_/chat"
import { useChatStore } from "../../store_"
import { ChatMainContainer } from "./ChatMainContainer"
import ChatSidebar from "./ChatSidebar"
import { ChatContainer } from "./ChatContainer"
import { ConversationsList } from "./ConversationList"
import { MessageInput } from "./MessageInput"

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
  const setRooms = useChatStore(state => state.setRooms)
  const setCurrentRoom = useChatStore(state => state.setCurrentRoom)
  const setMessages = useChatStore(state => state.setMessages)
  const rooms = useChatStore(state => state.rooms)
  const currentRoom = useChatStore(state => state.currentRoom)
  const messages = useChatStore(state => state.messages)

  const [isInit, setIsInit] = useState(false)

  useEffect(() => {
    (async () => {
      wsClient.init(xmppService, xmppUsername, xmppPassword)
      try {
        await wsClient.connect()
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
        const recentMsgs = await wsClient.getHistory(room.jid, 10) as Record<string, string>[]

          if (recentMsgs && recentMsgs[0]) {
            setMessages(room.jid, recentMsgs)
            recentMesssages.push(recentMsgs[0])
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

        setRooms(roomsForState)
        setCurrentRoom(roomsForState[0])
        setIsInit(true)
      } catch (e) {
        console.log("=-> xmpp connection error")
        console.log(e)
      }
    })()
  }, [])

  const onConversationClick = (index: number) => {
    setCurrentRoom(rooms[index])
  }

  const onYReachStart = () => {
    console.log("loading more messages")
  }

  return (
    <>
      <Container maxWidth="xl" style={{ height: "calc(100vh - 68px)" }}>
      <Box style={{ paddingBlock: "20px", height: "100%" }}>
        <ChatMainContainer>
          <ChatSidebar>
            <ConversationsList />
          </ChatSidebar>
          <ChatContainer />
        </ChatMainContainer>
      </Box>
    </Container >
    </>

  )
}
