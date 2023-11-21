import React, { useRef, useState } from "react"
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material"
import { useHistory } from "react-router"
import { TActiveRoomFilter, useStoreState } from "../../store"
import xmpp from "../../xmpp"
import StarPurple500Icon from "@mui/icons-material/StarPurple500"
import StarRateIcon from "@mui/icons-material/StarRate"
import { ROOMS_FILTERS } from "../../config/config"
import DeleteIcon from "@mui/icons-material/Delete"
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto"
import { useSnackbar } from "../../context/SnackbarContext"
import { uploadFile } from "../../http"

interface IRoomAvatar {
  roomJID: string
  onDeleteRoomClick: () => void
}

export function ChatAvatar({ roomJID, onDeleteRoomClick }: IRoomAvatar) {
  const currentRoomData = useStoreState((store) => store.userChatRooms).find(
    (e) => e?.jid === roomJID
  )
  const updateUserChatRoom = useStoreState((state) => state.updateUserChatRoom)
  const roomRoles = useStoreState((state) => state.roomRoles)
  const { showSnackbar } = useSnackbar()
  const currentRoomRole = roomRoles.find(
    (value) => value.roomJID === currentRoomData?.jid
  )?.role
  const fileReference = useRef(null)
  const [loading, setLoading] = useState<"chatIcon" | false>(false)

  const history = useHistory()
  const isFavouriteOrOfficialRoom =
    currentRoomData &&
    (currentRoomData.group === ROOMS_FILTERS.official ||
      currentRoomData.group === ROOMS_FILTERS.favourite)
  const isAllowedToChangeData =
    currentRoomRole === "moderator" ||
    currentRoomRole === "owner" ||
    currentRoomRole === "admin"
  const changeRoomType = (status: TActiveRoomFilter) => {
    const newRoomData = Object.assign({}, currentRoomData)
    newRoomData.group = status
    updateUserChatRoom(newRoomData)
    const favouriteRooms = useStoreState
      .getState()
      .userChatRooms.filter((r) => r.group === ROOMS_FILTERS.favourite)
    xmpp.setPrivateXmlRooms(favouriteRooms)
  }
  const goToChangeBackground = (e: React.MouseEvent<HTMLElement>) => {
    if (isAllowedToChangeData) {
      history.push("/changebg/" + roomJID)
    }
  }

  const changeRoomIcon = async (file: File) => {
    const formData = new FormData()
    formData.append("files", file)
    setLoading("chatIcon")
    try {
      const result = await uploadFile(formData)
      const roomAddress = roomJID.split("@")[0]
      xmpp.setRoomImage(
        roomAddress,
        result.data.results[0].location,
        currentRoomData.room_background,
        "icon"
      )

      const newRoomData = Object.assign({}, currentRoomData)
      newRoomData.room_thumbnail = result.data.results[0].location
      updateUserChatRoom(newRoomData)
      showSnackbar("success", "Success! The chat icon was set")
    } catch (error) {
      console.log(error)
      showSnackbar(
        "error",
        "An error occurred while loading the image. " +
          " ( " +
          error.message +
          " " +
          error.response.data +
          " )"
      )
    }
    setLoading(false)
  }
  return (
    <div style={{ cursor: "pointer" }}>
      <Box
        sx={{
          width: 200,
          height: 200,
          margin: 5,
          backgroundColor: "primary.dark",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          borderRadius: "10px",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            zIndex: 99_999,
          }}
        >
          <IconButton
            sx={{ color: "white" }}
            onClick={() =>
              isFavouriteOrOfficialRoom
                ? changeRoomType("")
                : changeRoomType(ROOMS_FILTERS.favourite)
            }
          >
            {isFavouriteOrOfficialRoom ? (
              <StarRateIcon />
            ) : (
              <StarPurple500Icon />
            )}
          </IconButton>
          {isAllowedToChangeData && (
            <IconButton
              sx={{ color: "white" }}
              onClick={() => fileReference.current?.click()}
            >
              <input
                type="file"
                name="file"
                id="file"
                onChange={(event) => changeRoomIcon(event.target.files[0])}
                ref={fileReference}
                style={{ display: "none" }}
                accept="image/*"
              />
              {loading === "chatIcon" ? (
                <CircularProgress style={{ color: "white" }} size={24} />
              ) : (
                <InsertPhotoIcon />
              )}
            </IconButton>
          )}
          {isAllowedToChangeData && (
            <IconButton sx={{ color: "red" }} onClick={onDeleteRoomClick}>
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
        <IconButton disableRipple onClick={goToChangeBackground}>
          {currentRoomData?.room_thumbnail &&
          currentRoomData?.room_thumbnail !== "none" ? (
            <Avatar
              sx={{
                width: 200,
                height: 200,
                borderRadius: "10px",
              }}
              variant="square"
              src={currentRoomData.room_thumbnail}
            />
          ) : (
            <Typography color={"white"} fontSize={"120px"}>
              {currentRoomData?.name[0]}
            </Typography>
          )}
        </IconButton>
      </Box>
    </div>
  )
}
