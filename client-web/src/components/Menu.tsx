import React, { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import { default as MuiMenu } from "@mui/material/Menu"
import MenuIcon from "@mui/icons-material/Menu"

import MenuItem from "@mui/material/MenuItem"
import { Divider } from "@mui/material"
import { useWeb3React } from "@web3-react/core"
import { configNFT, configDocuments } from "../config/config"
import xmpp from "../xmpp"
import { useHistory } from "react-router"
import { TUser, useStoreState } from "../store"
import { IUserAcl } from "../http"

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
    { name: "Explorer", id: "/explorer", visible: false },

    {
      name: "Transactions",
      id: "/explorer/address/" + walletAddress,
      visible: false,
    },
  ],
})

const menuActionsSection = {
  name: "Create",
  visible: true,

  items: [
    { name: "NFT", id: "/mint", visible: configNFT },
    {
      name: "Document",
      id: "/documents/upload",
      visible: configDocuments,
    },
  ],
}

const idActionsSection = (user: TUser) => ({
  name: "Id",
  visible: true,
  items: [
    { name: "Referrals", id: "/referrals", visible: true },
    { name: "Privacy and Data", id: "/privacy", visible: true },

    { name: "Sign out", id: "logout", visible: true },
  ],
})
const billingSection = (user: TUser) => ({
  name: "Billing",
  visible: !!user.stripeCustomerId || !!user?.company?.length,
  items: [
    {
      name: "Subscription",
      id: "/payments",
      visible: user.stripeCustomerId && !user?.subscriptions?.data?.length,
    },
    {
      name: "Organizations",
      id: "/organizations",
      visible: !!user?.company?.length,
    },
  ],
})
const userSection = (ACL: IUserAcl) => ({
  name: "Users",
  visible: false,

  items: [
    {
      name: "Users",
      id: "/users",
      visible: true,
    },
  ],
})
const adminSection = (user: TUser) => ({
  name: "Admin",
  visible: user?.ACL?.masterAccess || user.isAllowedNewAppCreate,
  items: [
    { name: "Statistics", id: "/statistics", visible: user?.ACL?.masterAccess },
    {
      name: "Apps",
      id: "/owner",
      visible: user.isAllowedNewAppCreate,
    },
  ],
})
const initMenuItems = (user: TUser, ACL: IUserAcl) => {
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
    menuActionsSection,
    billingSection(user),
    userSection(ACL),
    adminSection(user),
    idActionsSection(user),
  ]

  return items
}

export const Menu: React.FC<IMenu> = ({}) => {
  const { active, deactivate } = useWeb3React()
  const user = useStoreState((state) => state.user)
  const history = useHistory()
  const ACL = useStoreState((state) => state.ACL)
  const [menuItems, setMenuItems] = useState(initMenuItems(user, ACL))

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

  const onMenuItemClick = (id: string, type: string) => {
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
                    onClick={() => {
                      onMenuItemClick(item.id, element.name)
                      handleCloseUserMenu()
                    }}
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
