import { Box, CircularProgress } from "@mui/material";
import React from "react";

export const FullPageSpinner = () => {
  return (
    <Box
      sx={{
        height: "90vh",
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
};
