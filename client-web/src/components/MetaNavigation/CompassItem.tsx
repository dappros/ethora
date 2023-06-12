import { Box, Button } from "@mui/material";
import { useHistory } from "react-router";
import { CONFERENCEDOMAIN } from "../../constants";
import { IApiMetaRoom } from "./MetaNavigation";

const CHAT = "/chat/";

export const CompassItem = ({
  room,
  name,
  chatId,
  setDirection,
}: {
  room: IApiMetaRoom | undefined;
  name: string;
  chatId: string;
  setDirection: () => void;
}) => {
  const history = useHistory();
  if (!room) {
    return (
      <Box
        justifyContent={"center"}
        alignItems={"center"}
        style={{ padding: "10px 0" }}
      >
        <Button
          disabled={!chatId}
          onClick={() => {
            setDirection();
            history.push(CHAT + 'none');
          }}
        >
          {"Empty"}
        </Button>
      </Box>
    );
  }
  return (
    <Box
      justifyContent={"center"}
      alignItems={"center"}
      style={{ padding: "10px 0", maxWidth: 170 }}
    >
      <Button
        onClick={() => {
          setDirection();
          history.push(CHAT + room.roomJid + CONFERENCEDOMAIN);
        }}
      >
        {name}
      </Button>
    </Box>
  );
};
