import { useEffect, useState } from "react"
import { Link, useHistory, useLocation } from "react-router-dom"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import GroupIcon from "@mui/icons-material/Group"
import StarRateIcon from "@mui/icons-material/StarRate"

import {
  httpWithAuth,
} from "../http"
import xmpp from "../xmpp"

import { TActiveRoomFilter, useStoreState } from "../store"
import { Badge } from "@mui/material"
import { coinsMainName, defaultMetaRoom, ROOMS_FILTERS } from "../config/config"
import { Menu_ } from "./Menu_"

import defUserImage from "../assets/images/def-ava.png"

const coinImg = "/coin.png"

const roomFilters = [
  { name: ROOMS_FILTERS.official, Icon: StarRateIcon },
  { name: ROOMS_FILTERS.private, Icon: GroupIcon },
]

const AppTopNav_ = ({walletAddress, password, mainCoinBalance, rooms}: {walletAddress: string, password: string, mainCoinBalance: number, rooms: []}) => {
  // lib hooks
  const history = useHistory()
  const location = useLocation()

  // app state
  const setActiveRoomFilter = useStoreState(
    (state) => state.setActiveRoomFilter
  )
  const activeRoomFilter = useStoreState((state) => state.activeRoomFilter)

  // local state
  const [unreadMessagesCounts, setUnreadMessagesCounts] = useState({
    official: 0,
    meta: 0,
    private: 0,
  })

  // effect - mount
  useEffect(() => {
    xmpp.init(walletAddress, password as string)
  }, [])

  // effect - on rooms change
  useEffect(() => {
    getCounter()
  }, [rooms])

  // local helper func
  const navigateToLatestMetaRoom = async () => {
    try {
      const res = await httpWithAuth().get("/room/currentRoom")
      if (!res.data.result) {
        history.push("/chat/" + defaultMetaRoom.jid)

        return
      }
      history.push("/chat/" + res.data.result.roomId.roomJid)
    } catch (error) {
      console.log(error, "cannot navigate to room")
    }
  }

  // local helper func
  const getCounter = () => {
    const counts = {
      official: 0,
      meta: 0,
      private: 0,
    }
    const chats = useStoreState.getState().defaultChatRooms
    const chatsMap = {}
    for (const c of chats) {
      chatsMap[c.jid] = c
    }
    for (const item of rooms) {
      const splitedJid = item.jid.split("@")[0]
      if (chatsMap[splitedJid]) {
        counts.official += item.unreadMessages
      }
      if (!chatsMap[splitedJid] && +item.users_cnt < 3) {
        counts.private += item.unreadMessages
      }
      if (!chatsMap[splitedJid] && +item.users_cnt >= 3) {
        counts.meta += item.unreadMessages
      }
    }

    setUnreadMessagesCounts(counts)
  }

  const onRoomFilterClick = async (filter: TActiveRoomFilter) => {
    setActiveRoomFilter(filter)
    if (filter === ROOMS_FILTERS.meta) {
      await navigateToLatestMetaRoom()
      return
    }
    if (!location.pathname.includes("chat")) {
      history.push("/chat/none")
    }
  }

  return (
    <AppBar position="static">
      <Box sx={{ width: "100%", padding: "0 20px" }}>
        <Toolbar disableGutters>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Menu_ />
              {roomFilters.map((item, index) => {
                return (
                  <Badge
                    key={index}
                    badgeContent={unreadMessagesCounts[item.name]}
                    color="secondary"
                  >
                    <IconButton
                      onClick={() =>
                        onRoomFilterClick(item.name as TActiveRoomFilter)
                      }
                      id={item.name}
                      sx={{
                        color:
                          item.name === activeRoomFilter
                            ? "white"
                            : "rgba(255,255,255,0.8)",
                      }}
                    >
                      <item.Icon />
                    </IconButton>
                  </Badge>
                )
              })}
            </Box>
          </Box>
          <Box style={{ marginLeft: "auto" }}>
            {!!mainCoinBalance && (
              <Link to={"/"} style={{ textDecoration: "none" }} id="balance">
                <Box
                  sx={{
                    marginRight: "10px",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    backgroundColor: "rgba(255,255,255,0.8)",
                    color: "black",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingX: "5px",
                    borderRadius: "5px",
                    // paddingTop: 1
                  }}
                >
                  <img
                    alt=""
                    style={{ width: 30, height: 30, borderRadius: "100%" }}
                    src={user.profileImage || defUserImage}
                  />
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img
                      alt=""
                      style={{ width: 16, height: 16, borderRadius: "100%" }}
                      src={coinImg}
                    />
                    {mainCoinBalance?.balance}
                  </Box>
                </Box>
              </Link>
            )}
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  )
}

export default AppTopNav_
