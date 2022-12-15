import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import { sha256 } from "js-sha256";
import xmpp, { walletToUsername } from "../../xmpp";
import { useStoreState } from "../../store";
import { CONFERENCEDOMAIN } from "../../constants";
import { useLocation, useParams } from "react-router";
import { httpWithAuth } from "../../http";

export interface INewChat {}

export const NewChat: React.FC<INewChat> = ({}) => {
  const theme = useTheme();
  const user = useStoreState((state) => state.user);
  const [chatAvatar, setChatAvatar] = useState("");
  const location = useLocation<{
    metaDirection?: string;
    metaRoom: { roomJid: string };
  }>();
  const formik = useFormik({
    initialValues: {
      chatName: "",
      description: "",
      chatImage: "",
    },
    onSubmit: async ({ chatName, description }) => {
      const roomHash = sha256(chatName);
      const wallet = walletToUsername(user.walletAddress);
      xmpp.createNewRoom(wallet);

      xmpp.setOwner(roomHash);

      xmpp.roomConfig(roomHash, {
        roomName: chatName,
        roomDescription: description,
      });

      xmpp.setRoomImage(roomHash, chatAvatar, "", "icon");
      xmpp.subsribe(roomHash + CONFERENCEDOMAIN);
      if (location.state?.metaDirection) {
        const body = {
          name: chatName,
          roomJid: roomHash,
          from: {
            direction: location.state.metaDirection,
            roomJid: location.state.metaRoom.roomJid,
          },
        };
        const res = await httpWithAuth().post("/room", body);
        console.log(res?.data);
      }
    },
  });
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
              <Avatar
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  padding: "5px",
                  width: 60,
                  height: 60,
                }}
              ></Avatar>
            </IconButton>
            <TextField
              margin="dense"
              inputProps={{
                autoComplete: "off",
              }}
              label="Chat Name"
              name="chatName"
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
            type="text"
            fullWidth
            variant="outlined"
            onChange={formik.handleChange}
            value={formik.values.description}
          />
          <Button variant={"contained"} onClick={() => formik.handleSubmit()}>
            Sumbit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
