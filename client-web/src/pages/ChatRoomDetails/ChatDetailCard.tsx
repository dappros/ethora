import { useState } from "react";
import { Box, Container, IconButton, Typography } from "@mui/material";
import { useHistory, useParams } from "react-router";
import { useStoreState } from "../../store";
import xmpp from "../../xmpp";
import EditIcon from "@mui/icons-material/Edit";
import { DeleteDialog } from "../../components/DeleteDialog";
import { ChangeRoomInfoModal } from "./ChangeRoomInfoModal";
import { ChatAvatar } from "./ChatAvatar";

export default function ChatDetails() {
  const { roomJID } = useParams<{ roomJID: string }>();

  const [newDescription, setNewDescription] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showDeleteRoomDialog, setShowDeleteRoomDialog] = useState(false);
  const [showRoomRenameModal, setShowRoomRenameModal] = useState(false);
  const currentRoomData = useStoreState((store) => store.userChatRooms).find(
    (e) => e?.jid === roomJID
  );
  const roomRoles = useStoreState((state) => state.roomRoles);

  const history = useHistory();

  const currentRoomRole = roomRoles.find(
    (value) => value.roomJID === currentRoomData?.jid
  )?.role;

  const isAllowedToChangeData =
    currentRoomRole === "moderator" ||
    currentRoomRole === "owner" ||
    currentRoomRole === "admin";

  const handleChangeDescription = (newDescription: string) => {
    xmpp.changeRoomDescription(roomJID, newDescription);
  };

  const handleChangeRoomName = (newRoomName: string) => {
    xmpp.changeRoomName(roomJID, newRoomName);
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

  return (
    <Container
      style={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ChatAvatar
        roomJID={roomJID}
        onDeleteRoomClick={() => setShowDeleteRoomDialog(true)}
      />
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
            onClick={() => setShowDescriptionModal(true)}
            style={{
              marginLeft: 10,
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </Container>
      <ChangeRoomInfoModal
        title={"Set New Chat Name"}
        open={showRoomRenameModal}
        onClose={() => setShowRoomRenameModal(false)}
        onChange={setNewRoomName}
        onSubmit={() => {
          setShowRoomRenameModal(false);
          handleChangeRoomName(newRoomName);
        }}
      />
      <ChangeRoomInfoModal
        title={"Set New Chat Description"}
        open={showDescriptionModal}
        onClose={() => setShowDescriptionModal(false)}
        onChange={setNewDescription}
        onSubmit={() => {
          setShowDescriptionModal(false);
          handleChangeDescription(newDescription);
        }}
      />
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
