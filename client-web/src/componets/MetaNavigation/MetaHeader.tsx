import { Box, Button, Typography } from "@mui/material";
import { IApiMetaRoom } from "./MetaNavigation";
import coin from "../../assets/images/coin.png";
import { useHistory } from "react-router";
export const MetaHeader = ({
  room,
  direction,
  previousRoom,
}: {
  room: IApiMetaRoom | undefined;
  direction: string;
  previousRoom: IApiMetaRoom | undefined;
}) => {
  const history = useHistory();
  const onCreateClick = () => {
    history.push("/newchat", {
      metaDirection: direction,
      metaRoom: previousRoom,
    });
  };
  if (!room?.name) {
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box sx={{ alignItems: "center", display: "flex" }}>
          <Typography>
            This space is empty. You can build your own room here for{" "}
            <b>120 </b>
          </Typography>
          <img src={coin} style={{ width: 20, height: 20 }} alt={"coin"} />

          {/* <CreateNewChatButton
            onPress={() =>
              navigation.navigate(ROUTES.NEWCHAT, {
                metaDirection: direction,
                metaRoom: previousRoom,
              })
            }
          /> */}
        </Box>
        <Button onClick={onCreateClick}>Create Meta Room</Button>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography sx={{ fontWeight: "bold", fontSize: 18 }}>
        {room.name}
      </Typography>
      <Typography>{room.description}</Typography>
    </Box>
  );
};
