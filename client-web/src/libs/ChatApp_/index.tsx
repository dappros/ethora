import { Box, Container } from "@mui/material"
import { useEffect, useState } from "react"
import { wsClient } from "./wsClient_"
import { RoomType } from "./store_/chat"
import { useChatStore } from "./store_"
import ChatSidebar from "./ChatSidebar"
import { ChatContainer } from "./ChatContainer"
import { ConversationsList } from "./ConversationList"
import { AxiosResponse } from "axios"

import "./index.scss"
import { CreateNewChat } from "./CreateNewChat"
import { ModelChat } from "./models"

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

export function ChatApp(props: TChatProps) {
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

  const initFunc = async () => {
    try {
      wsClient.init(xmppService, xmppUsername, xmppPassword)
      await wsClient.connect()

      wsClient.presence(initRooms)
      let rooms = await wsClient.getRooms()

      if (isRestrictedToInitRooms) {
        rooms = rooms.filter((el => {
          return initRooms.includes(el.jid)
        }))
      }

      await wsClient.presence(rooms.map(el => el.jid))

      for (const room of rooms) {
        let msg = await wsClient.getHistory(room.jid, 1)
      }

      let chatList: Array<ModelChat> = []

      // id: string;
      // title: string;
      // usersCnt: string;
      // background: string;
      // thumbnail: string;
      // lastOpened: number;
      // messages: Array<ModelChatMessage>;
      // threadsMessages: Record<string, ModelChatMessage[]>;
      // editMessage: ModelChatMessage | null;
      // hasUnread: boolean;
      // muted: boolean;
      // loading: boolean;
      // sending: boolean;
      // allLoaded: boolean;
      // hasLoaded: boolean;

      for (const chat of rooms) {
        chatList.push({
          id: chat.jid,
          title: chat.name,
          usersCnt: chat.users_cnt,
          background: chat.room_background,
          thumbnail: chat.room_thumbnail,
          // TODO - get this from server
          lastOpened: 0,
          messages: [],
          threadsMessages: {},
          editMessage: null,
          hasUnread: false,
          muted: false,
          loading: false,
          sending: false,
          allLoaded: false,
          hasLoaded: false


        })
      }

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
    console.log("xmppUsername ", xmppUsername)
    initFunc().then(() => setIsInitCompleted(true))
  }, [xmppUsername])

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
    <div className="ChatApp">
      <Container maxWidth="xl" style={{ height: "calc(100vh - 68px)" }}>
        <Box style={{ paddingBlock: "20px", height: "100%" }}>
          <div className="ChatApp__inner">
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
                <CreateNewChat sendFile={props.sendFile} />
              </>
            )}
          </div>
        </Box>
      </Container >
    </div>
  )
}
