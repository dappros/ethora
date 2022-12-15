import { Box, Typography } from "@mui/material";
import { IApiMetaRoom } from "./MetaNavigation";
import coin from "../../assets/images/coin.png";
export const MetaHeader = ({
  room,
  direction,
  previousRoom,
}: {
  room: IApiMetaRoom | undefined;
  direction: string;
  previousRoom: IApiMetaRoom | undefined;
}) => {
  if (!room?.name) {
    return (
      <Box>
        <Typography>
          This space is empty. You can build your own room here for 120{" "}
          <img src={coin} style={{ width: 20, height: 20 }} alt={"coin"} />
        </Typography>
        {/* <CreateNewChatButton
            onPress={() =>
              navigation.navigate(ROUTES.NEWCHAT, {
                metaDirection: direction,
                metaRoom: previousRoom,
              })
            }
          /> */}
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
