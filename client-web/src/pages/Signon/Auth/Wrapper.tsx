import React, { ReactNode } from "react"
import { Box, useMediaQuery } from "@mui/material"
import { useTheme, Theme } from "@mui/system"

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
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"))

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        color: "#141414",
        backgroundColor: "#0052CD0D",
      }}
      className="responsiveWrapper"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          width: "calc(100% - 192px)",
          height: "calc(100% - 192px)",
          gap: "10.75%",
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default Wrapper
