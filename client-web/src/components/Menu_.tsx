import React from "react"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import { default as MuiMenu } from "@mui/material/Menu"
import MenuIcon from "@mui/icons-material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { Divider } from "@mui/material"
import { useWeb3React } from "@web3-react/core"
import xmpp from "../xmpp"
import { useHistory } from "react-router"
import { TUser, useStoreState } from "../store"

export interface IMenu {}

const menuAccountSection = (walletAddress: string) => ({
  name: "Wallet",
  visible: true,

  items: [
    {
      name: "My Profile",
      id: "/profile/" + walletAddress,
      visible: true,
    },
  ],
})

const idActionsSection = () => ({
  name: "Id",
  visible: true,
  items: [
    { name: "Sign out", id: "logout", visible: true },
  ],
})


const initMenuItems = (user: TUser) => {
  const items = [
    menuAccountSection(user.walletAddress),
    {
      name: "Messaging",
      visible: true,

      items: [
        { name: "Chats", id: "/chat/none", visible: true },
        { name: "New room", id: "/newchat", visible: true },
      ],
    },
    idActionsSection(),
  ]

  return items
}

export const Menu_: React.FC<IMenu> = ({}) => {
  const { active, deactivate } = useWeb3React()
  const user = useStoreState((state) => state.user)
  const history = useHistory()

  const menuItems = initMenuItems(user)

  const clearUser = useStoreState((state) => state.clearUser)

  const [anchorElementUser, setAnchorElementUser] =
    React.useState<null | HTMLElement>(null)

  const onLogout = () => {
    clearUser()
    xmpp.stop()
    useStoreState.getState().clearMessageHistory()
    useStoreState.getState().clearUserChatRooms()
    useStoreState.persist.rehydrate()
    if (active) {
      deactivate()
    }
    history.push("/")
  }

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElementUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElementUser(null)
  }

  const onMenuItemClick = (id: string) => {
    if (id === "logout") {
      onLogout()
      handleCloseUserMenu()
      return
    }

    history.push(id)

    handleCloseUserMenu()
  }

  return (
    <>
      <IconButton
        onClick={handleOpenUserMenu}
        sx={{ p: 0, color: "white", marginRight: "20px" }}
      >
        <MenuIcon />
      </IconButton>
      <MuiMenu
        sx={{ mt: "20px" }}
        id="menu-appbar"
        anchorEl={anchorElementUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElementUser)}
        onClose={handleCloseUserMenu}
      >
        {menuItems.map((element, index) => {
          if (!element.visible) {
            return null
          }
          return (
            <Box key={element.name}>
              {index !== 0 && <Divider />}

              <Typography
                sx={{
                  marginLeft: "7px",
                  fontWeight: "500",
                  textTransform: "uppercase",
                  marginY: "7px",
                }}
              >
                {element.name}
              </Typography>
              {element.items.map((item) => {
                if (!item.visible) {
                  return null
                }
                return (
                  <MenuItem
                    onClick={() => onMenuItemClick(item.id)}
                    key={item.id + item.name}
                  >
                    <Typography textAlign="center">{item.name}</Typography>
                  </MenuItem>
                )
              })}
            </Box>
          )
        })}
      </MuiMenu>
    </>
  )
}
