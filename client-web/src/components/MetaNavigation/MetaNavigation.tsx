import React, { useEffect, useState } from "react";

import { CompassItem } from "./CompassItem";
import {
  Box,
  CircularProgress,
  IconButton,
  Modal,
  useTheme,
} from "@mui/material";
import { MetaHeader } from "./MetaHeader";
import xmpp from "../../xmpp";
import { httpWithAuth } from "../../http";
import { CONFERENCEDOMAIN, DOMAIN } from "../../constants";
import { useStoreState } from "../../store";
import ExploreIcon from "@mui/icons-material/Explore";
type IRoom = {
  _id: string;
  contractAddress: string;
  createdAt: string;
  description: string;
  name: string;
  ownerId: string;
};

export interface IApiMetaRoom {
  _id: string;
  contractAddress: string;
  createdAt: Date;
  description: string;
  name: string;
  ownerId: string;
  ownerNavLinks: {
    east: IRoom | null;
    north: IRoom | null;
    south: IRoom | null;
    west: IRoom | null;
  };
  roomJid: string;
  updatedAt: Date;
  userNavLinks: {
    east: IRoom | null;
    north: IRoom | null;
    south: IRoom | null;
    west: IRoom | null;
  };
}

export interface IMetaNavigation {
  chatId: string;
  open: boolean;
  onClose: () => void;
}
const DIRECTIONS = {
  NORTH: "north",
  WEST: "west",
  SOUTH: "south",
  EAST: "east",
};
const SHORT_DIRECTIONS: Record<string, string> = {
  north: "n",
  west: "w",
  south: "s",
  east: "e",
};

const OPOSITE_DIRECTIONS: Record<string, string> = {
  [DIRECTIONS.WEST]: DIRECTIONS.EAST,
  [DIRECTIONS.EAST]: DIRECTIONS.WEST,
  [DIRECTIONS.SOUTH]: DIRECTIONS.NORTH,
  [DIRECTIONS.NORTH]: DIRECTIONS.SOUTH,
};

const getOpositeDirection = (direction: string) => {
  return OPOSITE_DIRECTIONS[direction];
};

// const findRoom = (id: string | undefined, arr: IApiMetaRoom[]) => {
//   if (!id) {
//     return null;
//   }
//   const room = arr.find((item) => item.idAddress === id);
//   if (!room) {
//     return null;
//   }
//   return room;
// };

const emptyMetaRoom = {
  name: "",
  description: "",
  ownerNavLinks: { west: null, east: null, north: null, south: null },
  ownerId: "",
  contractAddress: "",
  createdAt: new Date(),
  _id: "",
  roomJid: "",
  updatedAt: new Date(),
  userNavLinks: { west: null, east: null, north: null, south: null },
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  p: 2,
  outline: "none",
};
const roomRoute = "/room";
export const MetaNavigation: React.FC<IMetaNavigation> = ({
  chatId,
  open,
  onClose,
}) => {
  const [previousDirection, setPreviousDirection] = useState("");
  const [loading, setLoading] = useState(false);

  const [previousRoom, setPreviuosRoom] = useState<IApiMetaRoom | undefined>();
  const [currentMetaRoom, setCurrentMetaRoom] =
    useState<IApiMetaRoom>(emptyMetaRoom);
  const user = useStoreState((state) => state.user);

  const theme = useTheme();

  const getCurrentRoom = async () => {
    setLoading(true);
    try {
      const res = await httpWithAuth().get(roomRoute + "/getRoom/" + chatId);
      setCurrentMetaRoom(res.data.result);
    } catch (error) {
      setCurrentMetaRoom(emptyMetaRoom);
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!chatId) {
      setCurrentMetaRoom(emptyMetaRoom);
    }
    if (chatId && chatId !== 'none') {
      getCurrentRoom();
    }
  }, [chatId]);
  const checkEmptyDirections = () => {
    return (
      !currentMetaRoom?.ownerNavLinks?.south &&
      !currentMetaRoom?.ownerNavLinks?.east &&
      !currentMetaRoom?.ownerNavLinks?.west &&
      !currentMetaRoom?.ownerNavLinks?.north &&
      !currentMetaRoom?.userNavLinks?.south &&
      !currentMetaRoom?.userNavLinks?.east &&
      !currentMetaRoom?.userNavLinks?.west &&
      !currentMetaRoom?.userNavLinks?.north
    );
  };

  const sendMessage = (chatName: string, jid: string, isPrevious: boolean) => {
    const textEnter =
      user.firstName + " " + user.lastName + " " + "has joined" + " " + "<-";
    const textLeave =
      user.firstName + " " + user.lastName + " " + "has left" + " " + "->";
    const data = {
      senderFirstName: user.firstName,
      senderLastName: user.lastName,
      senderWalletAddress: user.walletAddress,
      isSystemMessage: true,
      tokenAmount: 0,
      receiverMessageId: "",
      mucname: chatName,
      photoURL: user.profileImage,
      roomJid: jid,
      isReply: false,
      mainMessage: undefined,
    };
    xmpp.sendMessageStanza(jid, isPrevious ? textLeave : textEnter, data);
  };
  const sendRoomJoin = async () => {
    try {
      const res = await httpWithAuth().post(roomRoute + "/join/" + chatId, {});
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (previousRoom?.name) {
      sendMessage(
        previousRoom.name,
        previousRoom.roomJid + CONFERENCEDOMAIN,
        true
      );
    }
  }, [previousRoom]);
  useEffect(() => {
    if (currentMetaRoom.name) {
      sendMessage(
        currentMetaRoom.name,
        currentMetaRoom.roomJid + CONFERENCEDOMAIN,
        false
      );
      sendRoomJoin();
    }
  }, [currentMetaRoom]);

  if (!currentMetaRoom.roomJid && !previousDirection) {
    return null;
  }

  const renderDirections = (direction: string) => {
    const oppositePreviousDirection = getOpositeDirection(previousDirection);
    if (checkEmptyDirections() && direction === oppositePreviousDirection) {
      return (
        <CompassItem
          name={oppositePreviousDirection + ":" + previousRoom?.name}
          chatId={chatId}
          room={previousRoom}
          setDirection={() => {
            setPreviousDirection(oppositePreviousDirection);
            setPreviuosRoom(previousRoom);
          }}
        />
      );
    }
    return (
      <CompassItem
        name={
          SHORT_DIRECTIONS[direction] +
          ":" +
          (currentMetaRoom.ownerNavLinks[direction]?.name ||
            currentMetaRoom.userNavLinks[direction]?.name)
        }
        chatId={chatId}
        room={
          currentMetaRoom?.ownerNavLinks?.[direction] ||
          currentMetaRoom?.userNavLinks?.[direction]
        }
        setDirection={() => {
          setPreviousDirection(direction);
          setPreviuosRoom(currentMetaRoom);
        }}
      />
    );
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {loading ? (
          <CircularProgress size={50} />
        ) : (
          <Box>
            <Box
              sx={{ bgcolor: "white", mb: "10px", borderRadius: "10px", p: 2 }}
            >
              <MetaHeader
                room={currentMetaRoom}
                direction={previousDirection}
                previousRoom={previousRoom}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "white",
                borderRadius: "10px",
                p: 2,
              }}
            >
              {renderDirections(DIRECTIONS.NORTH)}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ display: "flex" }}>
                  {renderDirections(DIRECTIONS.WEST)}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <IconButton sx={{ color: theme.palette.primary.main }}>
                    <ExploreIcon fontSize="large" />
                  </IconButton>
                </Box>
                <Box sx={{ display: "flex" }}>
                  {renderDirections(DIRECTIONS.EAST)}
                </Box>
              </Box>
              {renderDirections(DIRECTIONS.SOUTH)}
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};
