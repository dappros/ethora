import React, { ReactNode } from "react"
import { Box, useMediaQuery } from "@mui/material"
import { useTheme, Theme } from "@mui/system"
import "./Wrapper.scss"

interface WrapperProps {
  children: ReactNode
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  const theme: Theme = useTheme()
  const isMobileDevice = useMediaQuery(theme.breakpoints.down(1024))

  return (
    <Box
      sx={{
        display: "flex",
        color: "#141414",
        padding: isMobileDevice ? "24px 0px" : "5.5% 10%",
        backgroundImage: isMobileDevice ? "none !important" : "",
      }}
      className="responsiveWrapper"
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
          gap: "24px",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default Wrapper
