import React, { useState } from "react";
import { IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { DeleteDialog } from "../DeleteDialog";
import xmpp from "../../xmpp";
import { useStoreState } from "../../store";
import { useHistory } from "react-router";

export interface ILeaveRoomButton {
  roomJid: string;
}

export const LeaveRoomButton: React.FC<ILeaveRoomButton> = ({ roomJid }) => {
  const deleteUserChatRoom = useStoreState(s => s.deleteUserChatRoom)
  const [showLeaveRoom, setShowLeaveRoom] = useState(false);
  const history = useHistory()
  const onButtonClick = () => {
    setShowLeaveRoom(true);
  };
  const closeLeaveRoomModal = () => {
    setShowLeaveRoom(false);
  };
  const onLeaveClick = () => {
    xmpp.leaveTheRoom(roomJid);
    xmpp.unsubscribe(roomJid);
    deleteUserChatRoom(roomJid)
    closeLeaveRoomModal();
    history.push('/chat/none')
  };
  return (
    <>
      <IconButton sx={{color: 'black'}} onClick={onButtonClick}>
        <LogoutIcon />
      </IconButton>
      <DeleteDialog
        open={showLeaveRoom}
        onClose={closeLeaveRoomModal}
        onDeletePress={onLeaveClick}
        loading={false}
        title={"Leave Room"}
        description={"Do you want to leave this room?"}
        deleteButtonTitle={"Leave"}
      />
    </>
  );
};
