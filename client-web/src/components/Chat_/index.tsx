import { Box, Container } from "@mui/material"
import { useEffect, useState } from "react"
import { wsClient } from "../../api/wsClient_"
import { RoomType } from "../../store_/chat"
import { useChatStore } from "../../store_"
import { ChatMainContainer } from "./ChatMainContainer"
import ChatSidebar from "./ChatSidebar"
import { ChatContainer } from "./ChatContainer"
import { ConversationsList } from "./ConversationList"
import { AxiosResponse } from "axios"

import 'overlayscrollbars/overlayscrollbars.css';

export type TChatProps = {
  xmppPassword: string,
  xmppUsername: string,
  walletAddress?: string,
  firstName: string,
  lastName: string,
  profileImage: string,
  initRooms: string[],
  xmppService: string,
  isRestrictedToInitRooms: boolean,
  sendFile?: (formData: FormData) => Promise<AxiosResponse<any, any>>,
}

export function Chat_(props: TChatProps) {
  const {
    xmppService,
    xmppPassword,
    xmppUsername,
    initRooms,
    isRestrictedToInitRooms,
    firstName,
    lastName,
    profileImage,
    walletAddress
  } = props

  const [isLoading, setIsLoading] = useState(true)
  const [showSidebar, setShowSideBar] = useState(false)

  const setRooms = useChatStore(state => state.setRooms)
  const setCurrentRoom = useChatStore(state => state.setCurrentRoom)
  const setMessages = useChatStore(state => state.setMessages)
  const csSetUser = useChatStore(state => state.csSetUser)
  const xmppStatus = useChatStore(state => state.xmppStatus)
  const isInitCompleted = useChatStore(state => state.isInitCompleted)
  const setIsInitCompleted = useChatStore(state => state.setIsInitCompleted)

  csSetUser({firstName, lastName, profileImage, walletAddress})

  useEffect(() => {
    const beforeunloadHandler = (event) => {
      event.returnValue = 'Are you sure you want to leave this page?';
    }
    window.addEventListener('beforeunload', beforeunloadHandler)

    return () => window.removeEventListener('beforeunload', beforeunloadHandler)
  }, [])

  const initFunc = async () => {
    try {
      wsClient.init(xmppService, xmppUsername, xmppPassword)
      await wsClient.connect()

      wsClient.presence(initRooms)
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
      const recentMsgs = await wsClient.getHistory(room.jid, 30) as Record<string, string>[]

        if (recentMsgs && recentMsgs[0]) {
          setMessages(room.jid, recentMsgs)
          recentMesssages.push(recentMsgs[9])
        }
      }

      let roomsForState: Record<string, RoomType> = {}

      rooms.forEach((el, index) => {
        roomsForState[el.jid] = {
          jid: el.jid,
          title: el.name,
          usersCnt: el.users_cnt,
          roomBackground: el.room_background,
          room_thumbnail: el.room_thumbnail,
          groupName: '',
          newMessagesCount: 0,
          recentMessage: recentMesssages[index],
          loading: false,
          allLoaded: false
        }
      })

      setRooms(roomsForState)
      setCurrentRoom(roomsForState[Object.keys(roomsForState)[0]])
      setIsLoading(false)
    } catch (e) {
      console.log("")
      console.log(e)
    }
  }

  useEffect(() => {
    initFunc().then(() => setIsInitCompleted(true))
  }, [])

  useEffect(() => {
    if (xmppStatus === 'error' && !isInitCompleted) {
      initFunc().then(() => setIsInitCompleted(true))
    }
  }, [xmppStatus, isInitCompleted])

  useEffect(() => {
    if (isRestrictedToInitRooms && initRooms.length === 1) {
      setShowSideBar(false)
    } else {
      setShowSideBar(true)
    }
  }, [isRestrictedToInitRooms, initRooms])

  return (
    <>
      <Container maxWidth="xl" style={{ height: "calc(100vh - 68px)" }}>
      <Box style={{ paddingBlock: "20px", height: "100%" }}>
        <ChatMainContainer>
          {isLoading && <div>Loading</div>}
          {!isLoading && (
            <>
              {
                showSidebar && (
                  <ChatSidebar>
                    <ConversationsList />
                  </ChatSidebar>
                )
              }
              <ChatContainer {...props} />
            </>
          )}
        </ChatMainContainer>
      </Box>
    </Container >
    </>
  )
}
