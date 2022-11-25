import React, { useState } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import { TProfile } from "./types";
import defUserImage from "../../assets/images/def-ava.png";
import { useStoreState } from "../../store";
import EditProfileModal from "./EditProfileModal";
import { Button, IconButton } from "@mui/material";
import { createPrivateChat } from "../../helpers/chat/createPrivateChat";
import xmpp, { walletToUsername } from "../../xmpp";
import { useHistory } from "react-router-dom";
import { CONFERENCEDOMAIN } from "../../constants";
import { generateProfileLink } from "../../utils";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { QrModal } from "./QrModal";

type TProps = {
  profile?: TProfile;
  walletAddress?: string;
};

export default function UserCard({ profile, walletAddress }: TProps) {
  const [edit, setEdit] = useState(false);
  const user = useStoreState((state) => state.user);
  const [showQrModal, setShowQrModal] = useState(false);

  const history = useHistory();
  const openDirectChat = () => {
    createPrivateChat(
      user.walletAddress,
      walletAddress,
      user.firstName,
      profile.firstName,
        '@conference.dev.dxmpp.com'
    )
      .then((result) => {
          if(result.isNewRoom){
              const temporaryRoomData = {
                  jid: result.roomJid,
                  name: result.roomName,
                  room_background: "none",
                  room_thumbnail: "none",
                  users_cnt: "2",
                  unreadMessages: 0,
                  composing: "",
                  toUpdate: true
              }
              useStoreState.getState().setNewUserChatRoom(temporaryRoomData);
              history.push("/chat/" + result.roomJid);
          }else{
              history.push("/chat/" + result.roomJid);
          }
      })
      .catch((error) => {
        console.log("openPrivateRoom Error: ", error);
      });
  };
  if (profile) {
    return (
      <Box style={{ marginTop: "10px", marginRight: "10px" }}>
        <Card
          sx={{
            display: "flex",
            padding: "10px",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box sx={{ marginRight: "10px" }}>
            {!!profile.firstName && (
              <img
                style={{ width: "150px", borderRadius: "10px" }}
                alt=""
                src={profile.profileImage || defUserImage}
              />
            )}
          </Box>
          <Box>
            <Box sx={{ fontWeight: "bold" }}>
              {profile?.firstName} {profile?.lastName}
            </Box>
            {profile?.description && (
              <Box>Description: {profile?.description}</Box>
            )}
            <Button onClick={openDirectChat} variant="contained" size="small">
              Direct message
            </Button>
          </Box>
        </Card>
      </Box>
    );
  }
  return (
    <Box style={{ marginTop: "10px", marginRight: "10px" }}>
      <Card
        sx={{
          display: "flex",
          padding: "10px",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box sx={{ marginRight: "10px" }}>
          <img
            style={{ width: "150px", borderRadius: "10px" }}
            alt=""
            src={user.profileImage || defUserImage}
          />
        </Box>
        <Box>
          {!!user.firstName && (
            <>
              <Box sx={{ fontWeight: "bold", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {user?.firstName} {user?.lastName}
                <IconButton
                  sx={{ color: "black" }}
                  onClick={() => setShowQrModal(true)}
                >
                  <QrCodeIcon />
                </IconButton>
              </Box>
              {user?.description && <Box>Description: {user?.description}</Box>}
            </>
          )}
        </Box>

        {user.firstName && (
          <Button
            onClick={(e) => {
              setEdit(true);
            }}
          >
            Edit
          </Button>
        )}
      </Card>
      {edit && <EditProfileModal open={edit} setOpen={setEdit} user={user} />}
      <QrModal
        open={showQrModal}
        link={generateProfileLink({
          firstName: user.firstName,
          lastName: user.lastName,
          walletAddress: user.walletAddress,
          xmppId: walletToUsername(user.walletAddress) + CONFERENCEDOMAIN,
        })}
        onClose={() => setShowQrModal(false)}
      />
    </Box>
  );
}
