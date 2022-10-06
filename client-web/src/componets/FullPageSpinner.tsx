import { CircularProgress } from "@mui/material";
import React from "react";

export const FullPageSpinner = () => {
  return (
    <div
      style={{
        height: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </div>
  );
};
