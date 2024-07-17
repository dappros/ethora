import { Box, Icon, Rating, Typography } from "@mui/material";
import Logo from "../../assets/logo.tsx";
import React from "react";

interface LogoContentProps {}

const LogoContent: React.FC<LogoContentProps> = ({}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "48px",
        textAlign: "left",
        flex: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
          textAlign: "left",
          alignItems: "center",
        }}
      >
        <Logo />
        <Typography
          sx={{
            fontFamily: "Varela Round",
            fontWeight: 400,
            fontSize: "48px",
            color: "white",
          }}
        >
          Ethora
        </Typography>
      </Box>
      <Typography
        sx={{
          fontFamily: "Varela Round",
          fontWeight: 400,
          fontSize: "48px",
          color: "white",
        }}
      >
        Empower your community
      </Typography>
    </Box>
  );
};

export default LogoContent;
