import { Box, IconButton, Typography } from "@mui/material"
import * as React from "react"
import { TUserBlackList, useStoreState } from "../../store"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle"
import xmpp from "../../xmpp"
import { format } from "date-fns"
interface BlockingProperties {}

interface BlackListUserItemProperties {
  userItem: TUserBlackList
  handleRemove: (userId: string) => void
}

export const Blocking = (properties: BlockingProperties) => {
  const blacklist = useStoreState((store) => store.blackList)

  const handleRemoveUserFromBlackList = (userId: string) => {
    console.log(userId)
    xmpp.removeUserFromBlackList(userId)
    xmpp.getBlackList()
  }

  return (
    <Box
      style={{
        margin: "20px",
      }}
    >
      <Box>
        <Typography fontWeight={"bold"}>Users you have blocked</Typography>
        <Typography>
          The blocked users cannot message you or view your profile. Tap the bin
          icon if you wish to remove the block.
        </Typography>

        {blacklist.map((item) => {
          return (
            <BlackListUserItem
              handleRemove={handleRemoveUserFromBlackList}
              userItem={item}
            />
          )
        })}
      </Box>
    </Box>
  )
}

function BlackListUserItem(properties: BlackListUserItemProperties) {
  const { userItem, handleRemove } = properties

  return (
    <Box
      style={{
        marginTop: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: "300px",
      }}
    >
      <Box
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <AccountCircleIcon fontSize="large" />

        <Box
          style={{
            marginLeft: "10px",
          }}
        >
          <Typography>{userItem.fullName}</Typography>
          <Typography>
            {format(new Date(userItem.date * 1000), "dd MMMM yyyy")}
          </Typography>
        </Box>
      </Box>
      <IconButton onClick={() => handleRemove(userItem.user)}>
        <RemoveCircleIcon color="error" />
      </IconButton>
    </Box>
  )
}
