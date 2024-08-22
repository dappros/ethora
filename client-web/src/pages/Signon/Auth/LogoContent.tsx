import { Box, Icon, Rating, Typography } from "@mui/material"
import React from "react"
import LogoAndText from "../Icons/logoAndText"

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
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
          textAlign: isMobile ? "center" : "start",
          alignItems: "center",
          justifyContent: "start",
        }}
      >
        <LogoAndText />
      </Box>
      {!isMobile && (
        <Typography
          sx={{
            fontFamily: "Varela Round",
            fontWeight: 400,
            fontSize: "48px",
            color: "#141414",
            textAlign: "center",
          }}
        >
          Empower your community
        </Typography>
      )}
    </Box>
  )
}

export default LogoContent
