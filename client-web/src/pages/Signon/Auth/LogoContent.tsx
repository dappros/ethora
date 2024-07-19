import { Box, Icon, Rating, Typography } from "@mui/material"
import React from "react"
import Logo from "../Icons/logo"

interface LogoContentProps {
  isMobile?: boolean
}

const LogoContent: React.FC<LogoContentProps> = ({ isMobile = false }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: !isMobile ? "48px" : "24px",
        textAlign: !isMobile ? "left" : "center",
        flex: !isMobile ? 1 : 0,
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
          textAlign: isMobile ? "center" : "left",
          alignItems: "center",
          justifyContent: isMobile ? "center" : "start",
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
      {!isMobile && (
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
      )}
    </Box>
  )
}

export default LogoContent
