
import React, { useRef, useState, ChangeEvent } from "react";
import { Cropper, CropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
  useTheme,
  Modal,
} from "@mui/material";
import { useFormik } from "formik";
import { sha256 } from "js-sha256";
import xmpp from "../../xmpp";
import { useStoreState } from "../../store";
import { CONFERENCEDOMAIN } from "../../constants";
import { useHistory, useLocation } from "react-router";
import { httpWithAuth } from "../../http";
import { useSnackbar } from "../../context/SnackbarContext";
import { styled } from "@mui/material";
import PhotoSharpIcon from '@mui/icons-material/PhotoSharp';
import Badge from '@mui/material/Badge'



const StyledTextField = styled(TextField)(() => ({
  "& .MuiFormLabel-asterisk": {
    color: "red"
  }
}));

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "min-content",
  height: "auto",
  borderRadius: '10px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};



export interface INewChat { }

const NewChat: React.FC<INewChat> = ({ }) => {
  const theme = useTheme();
  const user = useStoreState((state) => state.user);
  const setActiveRoomFilter = useStoreState((state) => state.setActiveRoomFilter);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<CropperRef>(null);

  const [image, setImage] = useState(
    '',
  );

  const onCrop = () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas()

      if (canvas) {
        let file = new File([canvas.toDataURL()], "newAvatar.png", { type: "image/png" })
        console.log(file)
        onFileChange(file)

      }
    }
  };
  const onLoadImage = (event: ChangeEvent<HTMLInputElement>) => {
    handleOpen()
    if (inputRef.current) {
      inputRef.current.click();
    }
    console.log(event.target)
    const file = event.target.files && event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };
  
  const onFileChange = async (e: any) => {
    setLoading(true);
    console.log(e)
    try {
      const fd = new FormData();
      fd.append("files", e);
      const fileUploadResp = await httpWithAuth().post("/files", fd);
      console.log(fd, fileUploadResp)
      formik.setValues((prev) => ({
        ...prev,
        chatImage: fileUploadResp.data.results[0].location,
      }));
      console.log(fileUploadResp.data.results[0].location)
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    handleClose()
  };



  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
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
    onSubmit: async ({ chatName, description, chatImage }) => {
      setLoading(true);
      const randomNumber = Math.round(Math.random() * 100000)
      const name = chatName + new Date().getTime() + randomNumber;
      const roomHash = sha256(name);
      xmpp.createNewRoom(roomHash);

      xmpp.setOwner(roomHash);

      xmpp.roomConfig(roomHash, {
        roomName: chatName,
        roomDescription: description,
      });

      xmpp.setRoomImage(roomHash, chatImage, "", "icon");
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
      }
      setActiveRoomFilter('private')
      setLoading(false);
      showSnackbar("success", "Room created successfully");
      history.push("/chat/" + roomHash);
    },
  });



  return (
    <Container maxWidth="xl" style={{ height: "calc(100vh - 80px)" }}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Cropper
            ref={cropperRef}
            src={image}
            className="example__cropper"
            backgroundClassName="example__cropper-background"
          />
          {image && (<>
            <button className="example__button" onClick={onCrop}>
              Set Image
            </button>
          </>)}
        </Box>
      </Modal>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "fit-content",
          m: "auto",
          mt: "3rem",
        }}
      >

        <Typography variant="h4">Create a new room</Typography>



        <IconButton>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="raised-button-file"
            type="file"
            ref={inputRef}
            onChange={onLoadImage}
          />
          <label htmlFor="raised-button-file">
            <Badge
              badgeContent={"+"}
              color="secondary"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              overlap="circular"
            >
              <Avatar
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '50%',
                  borderColor: "red",
                  width: 55,
                  height: 55,
                }}
                src={formik.values.chatImage}
              >
                <PhotoSharpIcon fontSize="large" />
              </Avatar>
            </Badge>
          </label>
        </IconButton>
        <StyledTextField
          margin="dense"
          inputProps={{
            autoComplete: "off",
          }}
          label="Chat Name"
          name="chatName"
          type="text"
          fullWidth
          required
          variant="outlined"
          onChange={formik.handleChange}
          value={formik.values.chatName}
        />


        <TextField
          margin="dense"
          inputProps={{
            autoComplete: "off",
          }}
          label="Description"
          name="description"
          type="text"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          onChange={formik.handleChange}
          value={formik.values.description}
        />

        <Button
          variant={"outlined"}
          disabled={loading}
          onClick={() => formik.handleSubmit()}
          sx={{
            mt: "1rem",
          }}
        >
          Sumbit
        </Button>

      </Box>

    </Container>
  );
};
export default NewChat;