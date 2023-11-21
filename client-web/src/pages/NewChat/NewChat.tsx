import React, { useState } from "react"
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material"
import { useFormik } from "formik"
import { sha256 } from "js-sha256"
import xmpp from "../../xmpp"
import { useStoreState } from "../../store"
import { CONFERENCEDOMAIN } from "../../constants"
import { useHistory, useLocation } from "react-router"
import { httpWithAuth } from "../../http"
import { useSnackbar } from "../../context/SnackbarContext"

export interface INewChat {}

const NewChat: React.FC<INewChat> = ({}) => {
  const theme = useTheme()
  const user = useStoreState((state) => state.user)
  const setActiveRoomFilter = useStoreState(
    (state) => state.setActiveRoomFilter
  )

  const { showSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const location = useLocation<{
    metaDirection?: string
    metaRoom: { roomJid: string }
  }>()
  const formik = useFormik({
    initialValues: {
      chatName: "",
      description: "",
      chatImage: "",
    },
    onSubmit: async ({ chatName, description, chatImage }) => {
      setLoading(true)
      const randomNumber = Math.round(Math.random() * 100_000)
      const name = chatName + Date.now() + randomNumber
      const roomHash = sha256(name)
      xmpp.createNewRoom(roomHash)

      xmpp.setOwner(roomHash)

      xmpp.roomConfig(roomHash, {
        roomName: chatName,
        roomDescription: description,
      })

      xmpp.setRoomImage(roomHash, chatImage, "", "icon")
      xmpp.subsribe(roomHash + CONFERENCEDOMAIN)
      if (location.state?.metaDirection) {
        const body = {
          name: chatName,
          roomJid: roomHash,
          from: {
            direction: location.state.metaDirection,
            roomJid: location.state.metaRoom.roomJid,
          },
        }
        const res = await httpWithAuth().post("/room", body)
      }
      setActiveRoomFilter("private")
      setLoading(false)
      showSnackbar("success", "Room created successfully")
      history.push("/chat/" + roomHash)
    },
  })
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)

    try {
      const fd = new FormData()
      fd.append("files", e.target.files[0])
      const fileUploadResp = await httpWithAuth().post("/files", fd)
      formik.setValues((previous) => ({
        ...previous,
        chatImage: fileUploadResp.data.results[0].location,
      }))
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }
  return (
    <Container maxWidth="xl" style={{ height: "calc(100vh - 80px)" }}>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4">Create new chat</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "50vw",
              gap: "10px",
            }}
          >
            <IconButton>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={onFileChange}
              />
              <label htmlFor="raised-button-file" id="avatar">
                <Avatar
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    // padding: "5px",
                    width: 60,
                    height: 60,
                  }}
                  src={formik.values.chatImage}
                ></Avatar>
              </label>
            </IconButton>
            <TextField
              margin="dense"
              inputProps={{
                autoComplete: "off",
              }}
              label="Chat Name"
              name="chatName"
              id="chatName"
              type="text"
              fullWidth
              variant="outlined"
              onChange={formik.handleChange}
              value={formik.values.chatName}
            />
          </Box>
          <TextField
            margin="dense"
            inputProps={{
              autoComplete: "off",
            }}
            label="Description"
            name="description"
            id="description"
            type="text"
            fullWidth
            variant="outlined"
            onChange={formik.handleChange}
            value={formik.values.description}
          />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <Button
              variant={"outlined"}
              id="submitChat"
              disabled={loading}
              onClick={() => formik.handleSubmit()}
            >
              Sumbit
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
export default NewChat
