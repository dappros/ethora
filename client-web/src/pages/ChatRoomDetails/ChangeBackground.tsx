import React, { useState } from "react";
import { useParams } from "react-router";
import { Box, Container } from "@mui/material";
import { defaultChatBackgroundThemes } from "../../config/config";
import { useStoreState } from "../../store";
import { useSnackbar } from "../../context/SnackbarContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import xmpp from "../../xmpp";

const BackgroundCard = ({
  url,
  selected,
  onClick,
}: {
  url: string;
  selected: boolean;
  onClick: () => void;
}) => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${url})`,
        width: 200,
        height: 400,
        borderRadius: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {selected && (
        <CheckCircleIcon
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10111,
          }}
          fontSize={"large"}
        />
      )}
      <div
        onClick={onClick}
        style={{
          opacity: selected ? 0.4 : 0,
          height: "100%",
          width: "100%",
          backgroundColor: "white",
          cursor: "pointer",
        }}
      />
    </Box>
  );
};

export interface IChangeBackground {}

const ChangeBackground: React.FC<IChangeBackground> = ({}) => {
  const { roomJID } = useParams<{ roomJID: string }>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const {showSnackbar} = useSnackbar()
  const currentRoom = useStoreState((state) =>
    state.userChatRooms.find((item) => item.jid === roomJID)
  );
  const onBackgroundClick = (index: number) => {
    setSelectedIndex(index);
    const background = defaultChatBackgroundThemes[index];
    const roomAddress = roomJID.split("@")[0];
    xmpp.setRoomImage(
      roomAddress,
      currentRoom.room_thumbnail,
      background.value,
      "background"
    );
    showSnackbar('success', 'Success! The chat background was set.')
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        height: "calc(100vh - 68px)",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: '10px 0'
      }}
    >
      <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {defaultChatBackgroundThemes.map((item, i) => {
          return (
            <BackgroundCard
              onClick={() => onBackgroundClick(i)}
              selected={selectedIndex === i}
              key={item.value}
              url={item.value}
            />
          );
        })}
      </Box>
    </Container>
  );
};
export default ChangeBackground;
