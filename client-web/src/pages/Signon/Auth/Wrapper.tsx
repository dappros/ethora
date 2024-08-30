import React, { ReactNode } from "react"
import { Box, useMediaQuery } from "@mui/material"
import { useTheme, Theme } from "@mui/system"
import "./Wrapper.scss"
import Circles from "../Icons/circles"

interface WrapperProps {
  children: ReactNode
}

const Background = () => (
  <Box
    sx={{
      position: "absolute",
      width: "calc(100%)",
      height: "calc(100%)",
    }}
  >
    <Box
      sx={{
        flex: 1,
        background: "linear-gradient(213.76deg, #013FC4 0%, #930A95 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "50%",
        width: "100%",
      }}
    />
    <Box
      sx={{
        flex: 1,
        backgroundColor: "white",
        height: "50%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  </Box>
)

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  const theme: Theme = useTheme()
  const isMobileDevice = useMediaQuery(theme.breakpoints.down(1024))

  return (
    <Box
      sx={{
        display: "flex",
        color: "#141414",
        padding: isMobileDevice ? "24px 0px" : "5.5% 10%",
        backgroundImage: isMobileDevice ? "none !important" : "inherit",
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
