import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useStoreState } from "../store";

export interface IHeaderWarningMessage {
  message: string;
}

export const HeaderWarningMessage: React.FC<IHeaderWarningMessage> = ({
  message,
}) => {
  const setShowHeaderError = useStoreState((state) => state.setShowHeaderError);
  const hideWarning = () => setShowHeaderError(false);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        position: "relative",
        bgcolor: "error.dark",
        textAlign: "center",
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        padding: 1,
      }}
    >
      <Typography sx={{ color: "white" }}>{message}</Typography>
      <IconButton
        onClick={hideWarning}
        sx={{
          color: "white",
          position: "absolute",
          right: 0,
          top: "-50%",
          transform: "translateY(50%)",
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
};
