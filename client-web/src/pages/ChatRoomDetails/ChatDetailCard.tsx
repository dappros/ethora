import React, { useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useHistory, useParams } from "react-router";
import { TActiveRoomFilter, useStoreState } from "../../store";
import xmpp from "../../xmpp";
import EditIcon from "@mui/icons-material/Edit";
import StarPurple500Icon from "@mui/icons-material/StarPurple500";
import StarRateIcon from "@mui/icons-material/StarRate";
import { ROOMS_FILTERS } from "../../config/config";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { DeleteDialog } from "../../componets/DeleteDialog";
import { useSnackbar } from "../../context/SnackbarContext";
import { uploadFile } from "../../http";

export default function ChatDetailCard() {
  const { roomJID } = useParams<{ roomJID: string }>();

  const [newDescription, setNewDescription] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteRoomDialog, setShowDeleteRoomDialog] = useState(false);
  const [showRoomRenameModal, setShowRoomRenameModal] = useState(false);

  const [loading, setLoading] = useState<"chatIcon" | false>(false);

  const currentRoomData = useStoreState((store) => store.userChatRooms).find(
    (e) => e?.jid === roomJID
  );
  const updateUserChatRoom = useStoreState((state) => state.updateUserChatRoom);
  const roomRoles = useStoreState((state) => state.roomRoles);
  const updateChatRoomGroups = useStoreState(
    (state) => state.updateChatRoomGroups
  );
  const currentRoomGroup = useStoreState(
    (store) => store.userChatRoomGroups
  ).find((e) => e?.jid === roomJID);

  const { showSnackbar } = useSnackbar();
  const history = useHistory();
  const fileRef = useRef(null);

  const currentRoomRole = roomRoles.find(
    (value) => value.roomJID === currentRoomData?.jid
  )?.role;

  const isAllowedToChangeData =
    currentRoomRole === "moderator" ||
    currentRoomRole === "owner" ||
    currentRoomRole === "admin";

  const isFavouriteOrOfficialRoom =
    currentRoomGroup &&
    (currentRoomGroup.group === ROOMS_FILTERS.official ||
      currentRoomGroup.group === ROOMS_FILTERS.favourite);

  const handleChangeDescription = (newDescription: string) => {
    xmpp.changeRoomDescription(roomJID, newDescription);
  };

  const handleChangeRoomName = (newRoomName: string) => {
    xmpp.changeRoomName(roomJID, newRoomName);
  };

  const changeRoomType = (status: TActiveRoomFilter) => {
    let roomData = {
      jid: currentRoomData.jid,
      group: status,
    };
    updateChatRoomGroups(roomData);
  };
  const goToChangeBackground = (e: React.MouseEvent<HTMLElement>) => {
    if (isAllowedToChangeData) {
      history.push("/changebg/" + roomJID);
    }
  };
  const closeRoomDeleteDialog = () => {
    setShowDeleteRoomDialog(false);
  };
  const leaveTheRoom = async () => {
    xmpp.leaveTheRoom(roomJID);
    xmpp.unsubscribe(roomJID);
    closeRoomDeleteDialog();
    history.push("/chat/none");
  };

  const changeRoomIcon = async (file: File) => {
    const formData = new FormData();
    formData.append("files", file);
    setLoading("chatIcon");
    try {
      const result = await uploadFile(formData);
      const roomAddress = roomJID.split("@")[0];
      xmpp.setRoomImage(
        roomAddress,
        result.data.results[0].location,
        currentRoomData.room_background,
        "icon"
      );

      let newRoomData = Object.assign({}, currentRoomData);
      newRoomData.room_thumbnail = result.data.results[0].location;
      updateUserChatRoom(newRoomData);
      showSnackbar("success", "Success! The chat icon was set");
    } catch (error) {
      console.log(error);
      showSnackbar(
        "error",
        "An error occurred while loading the image. " +
          " ( " +
          error.message +
          " " +
          error.response.data +
          " )"
      );
    }
    setLoading(false);
  };
  return (
    <Container
      style={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
              zIndex: 99999,
            }}
          >
            <IconButton
              sx={{ color: "white" }}
              onClick={() =>
                isFavouriteOrOfficialRoom
                  ? changeRoomType("")
                  : changeRoomType(ROOMS_FILTERS.official)
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
                onClick={() => fileRef.current?.click()}
              >
                <input
                  type="file"
                  name="file"
                  id="file"
                  onChange={(event) => changeRoomIcon(event.target.files[0])}
                  ref={fileRef}
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
              <IconButton
                sx={{ color: "red" }}
                onClick={() => setShowDeleteRoomDialog(true)}
              >
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
      <Box flexDirection={"row"} display="flex">
        <Typography fontSize={"20px"} fontWeight={"bold"}>
          {currentRoomData?.name}
        </Typography>
        {isAllowedToChangeData && (
          <IconButton
            onClick={() => setShowRoomRenameModal(true)}
            style={{
              marginLeft: 10,
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      <Container
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <Typography fontSize={"20px"}>
          {currentRoomData?.description
            ? currentRoomData.description
            : "No description"}
        </Typography>
        {isAllowedToChangeData && (
          <IconButton
            onClick={() => setShowModal(true)}
            style={{
              marginLeft: 10,
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </Container>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Set new description
          </Typography>
          <TextField
            onChange={(e) => setNewDescription(e.target.value)}
            margin="normal"
            id="outlined-basic"
            label="Description"
            variant="outlined"
          />
          <Button
            onClick={() => {
              setShowModal(false);
              handleChangeDescription(newDescription);
            }}
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
            variant="outlined"
          >
            <Typography id="modal-modal-description">Submit</Typography>
          </Button>
        </Box>
      </Modal>
      <Modal
        open={showRoomRenameModal}
        onClose={() => setShowRoomRenameModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Set new room name
          </Typography>
          <TextField
            onChange={(e) => setNewRoomName(e.target.value)}
            margin="normal"
            id="outlined-basic"
            label="Room Name"
            variant="outlined"
          />
          <Button
            onClick={() => {
              setShowRoomRenameModal(false);
              handleChangeRoomName(newRoomName);
            }}
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
            variant="outlined"
          >
            <Typography id="modal-modal-description">Submit</Typography>
          </Button>
        </Box>
      </Modal>
      <DeleteDialog
        open={showDeleteRoomDialog}
        title={"Delete"}
        description={"Do you want to delete this room?"}
        onDeletePress={leaveTheRoom}
        onClose={closeRoomDeleteDialog}
      />
    </Container>
  );
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  justifyContent: "center",
  flex: "display",
};
