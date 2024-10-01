import { Box, Typography } from "@mui/material"
import React, { useState } from "react"
import LogoAndText from "../Icons/logoAndText"
import { useStoreState } from "../../../store"

interface LogoContentProps {
  isMobile?: boolean
}

const LogoContent: React.FC<LogoContentProps> = ({ isMobile = false }) => {
  const config = useStoreState((state) => state.config)
  const [imageError, setImageError] = useState(false)

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
        textAlign: "left",
        minWidth: "221px",
        justifyContent: "center",
        gap: "40px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          textAlign: isMobile ? "center" : "start",
          justifyContent: isMobile ? "center" : "start",
        }}
      >
        {config.logoImage && config.logoImage !== "" && !imageError ? (
          <img
            alt="logoImage"
            src={config.logoImage}
            onError={() => setImageError(true)}
          />
        ) : (
          <LogoAndText />
        )}
      </Box>
      {!isMobile && (
        <Typography
          sx={{
            fontFamily: "Varela Round",
            fontWeight: 400,
            fontSize: "48px",
            color: "#141414",
            textAlign: "left",
            lineHeight: "56px",
            height: "112px",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {config?.appTagline ? config.appTagline : "Empower your community"}
        </Typography>
      )}
    </Box>
  )
}

export default LogoContent
