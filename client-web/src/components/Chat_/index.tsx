import { Box, Container } from "@mui/material"
import { useEffect, useState } from "react"
import { wsClient } from "../../api/wsClient_"
import { RoomType } from "../../store_/chat"
import { useChatStore } from "../../store_"
import ChatSidebar from "./ChatSidebar"
import { ChatContainer } from "./ChatContainer"
import { ConversationsList } from "./ConversationList"
import { AxiosResponse } from "axios"

import "./index.scss"
import { CreateNewChat } from "./CreateNewChat"
import ChatRoom from "../../../../experimental-chat-component/src/components/ChatRoom"
import { store } from "../../../../experimental-chat-component/src/store"

import { Provider } from "react-redux"

export type TChatProps = {
  xmppPassword: string
  xmppUsername: string
  walletAddress?: string
  firstName: string
  lastName: string
  profileImage: string
  initRooms: string[]
  xmppService: string
  isRestrictedToInitRooms: boolean
  sendFile?: (formData: FormData) => Promise<AxiosResponse<any, any>>
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
    walletAddress,
  } = props

  const [isLoading, setIsLoading] = useState(true)
  const [showSidebar, setShowSideBar] = useState(false)
  // const isInit

  const setRooms = useChatStore((state) => state.setRooms)
  const setCurrentRoom = useChatStore((state) => state.setCurrentRoom)
  const setMessages = useChatStore((state) => state.setMessages)
  const csSetUser = useChatStore((state) => state.csSetUser)
  const xmppStatus = useChatStore((state) => state.xmppStatus)
  const isInitCompleted = useChatStore((state) => state.isInitCompleted)
  const setIsInitCompleted = useChatStore((state) => state.setIsInitCompleted)
  const setThreadMessages = useChatStore((state) => state.setThreadMessages)
  const currentRoom = useChatStore((state) => state.currentRoom)

  csSetUser({ firstName, lastName, profileImage, walletAddress })

  // useEffect(() => {
  //   const beforeunloadHandler = (event) => {
  //     event.returnValue = 'Are you sure you want to leave this page?';
  //   }
  //   window.addEventListener('beforeunload', beforeunloadHandler)

  //   return () => window.removeEventListener('beforeunload', beforeunloadHandler)
  // }, [])

  const initFunc = async () => {
    try {
      wsClient.init(xmppService, xmppUsername, xmppPassword)
      await wsClient.connect()

      wsClient.presence(initRooms)
      let rooms = await wsClient.getRooms()

      console.log({ rooms: rooms })

      if (isRestrictedToInitRooms) {
        rooms = rooms.filter((el) => {
          return initRooms.includes(el.jid)
        })
      }

      await wsClient.presence(rooms.map((el) => el.jid))
      const recentMesssages = []

      for (const room of rooms) {
        let recentMsgs = await wsClient.getHistory(room.jid, 30)

        let threadsMsgs = []

        recentMsgs = recentMsgs.filter((el) => {
          if (el.mainMessage) {
            threadsMsgs.push(el)
          }

          if (el.mainMessage && el.showInChannel === "false") {
            return false
          }

          return true
        })

        if (recentMsgs && recentMsgs[0]) {
          setMessages(room.jid, recentMsgs)
          setThreadMessages(threadsMsgs)
          recentMesssages.push(recentMsgs[recentMsgs.length - 1])
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
          groupName: "",
          newMessagesCount: 0,
          recentMessage: recentMesssages[index],
          loading: false,
          allLoaded: false,
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
    console.log("xmppUsername ", xmppUsername)
    initFunc().then(() => setIsInitCompleted(true))
  }, [xmppUsername])

  useEffect(() => {
    if (xmppStatus === "error" && !isInitCompleted) {
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
    <div className="ChatApp">
      <Container maxWidth="xl" style={{ height: "calc(100vh - 68px)" }}>
        <Box style={{ paddingBlock: "20px", height: "100%" }}>
          <div className="ChatApp__inner">
            {isLoading && <div>Loading</div>}
            {!isLoading && (
              <>
                {showSidebar && (
                  <ChatSidebar>
                    <ConversationsList />
                  </ChatSidebar>
                )}
                <Provider store={store}>
                  <ChatRoom
                    key={currentRoom.jid}
                    defaultRoom={currentRoom}
                    isLoading={isLoading}
                    defaultUser={{ ...props, _id: props.walletAddress }}
                  />
                </Provider>
                {/* <ChatContainer {...props} /> */}
                <CreateNewChat sendFile={props.sendFile} />
              </>
            )}
          </div>
        </Box>
      </Container>
    </div>
  )
}
