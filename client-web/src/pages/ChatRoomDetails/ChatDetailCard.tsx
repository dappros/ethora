import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
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

export default function ChatDetailCard() {
  const { roomJID } = useParams<{ roomJID: string }>();
  const [newDescription, setNewDescription] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showRoomRenameModal, setShowRoomRenameModal] = useState(false);
  const currentRoomData = useStoreState((store) => store.userChatRooms).filter(
    (e) => e.jid === roomJID
  )[0];
  const history = useHistory()

  const updateChatRoomGroups = useStoreState(
    (state) => state.updateChatRoomGroups
  );
  const currentRoomGroup = useStoreState(
    (store) => store.userChatRoomGroups
  ).filter((e) => e.jid === roomJID)[0];
  const isFavouriteOrOfficialRoom =
    currentRoomGroup &&
    (currentRoomGroup.group === ROOMS_FILTERS.official ||
      currentRoomGroup.group === ROOMS_FILTERS.favourite);

  const handleChangeDescription = (newDescription: string) => {
    xmpp.changeRoomDescription(roomJID, newDescription);
  };

  const handleChangeRoomName = (newRoomName: string) => {
    xmpp.changeRoomName(roomJID, newRoomName);
  }

  const changeRoomType = (status: TActiveRoomFilter) => {
    let roomData = {
      jid: currentRoomData.jid,
      group: status,
    };
    updateChatRoomGroups(roomData);
  };
  const goToChangeBackground = () => {
    history.push('/changebg/'+ roomJID)
  }
  return (
    <Container
      style={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{cursor: 'pointer'}} onClick={goToChangeBackground}>
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
        <IconButton
          sx={{ position: "absolute", top: 0, right: 0, color: "white" }}
          onClick={() =>
            isFavouriteOrOfficialRoom
              ? changeRoomType("")
              : changeRoomType(ROOMS_FILTERS.official)
          }
        >
          {isFavouriteOrOfficialRoom ? <StarRateIcon /> : <StarPurple500Icon />}
        </IconButton>

        {currentRoomData?.room_thumbnail &&
        currentRoomData?.room_thumbnail !== "none" ? (
          <Avatar
            sx={{
              width: 100,
              height: 100,
            }}
            variant="square"
            src={currentRoomData.room_thumbnail}
          />
        ) : (
          <Typography color={"white"} fontSize={"120px"}>
            {currentRoomData?.name[0]}
          </Typography>
        )}
      </Box>
      </div>
      <Box flexDirection={'row'} display="flex">
      <Typography fontSize={"20px"} fontWeight={"bold"}>
        {currentRoomData?.name}
      </Typography>
      <IconButton
          onClick={() => setShowRoomRenameModal(true)}
          style={{
            marginLeft: 10,
          }}
        >
          <EditIcon fontSize="small" />
      </IconButton>
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
        <IconButton
          onClick={() => setShowModal(true)}
          style={{
            marginLeft: 10,
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
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
