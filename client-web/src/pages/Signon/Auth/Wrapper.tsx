import React, { ReactNode } from "react"
import { Box, useMediaQuery } from "@mui/material"
import { useTheme, Theme } from "@mui/system"
import "./Wrapper.scss"
import { useStoreState } from "../../../store"
import { hexToRGBA } from "../../../helpers/hetToRgba"

interface WrapperProps {
  children: ReactNode
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  const theme: Theme = useTheme()
  const isMobileDevice = useMediaQuery(theme.breakpoints.down(1024))
  const config = useStoreState((state) => state.config)

  return (
    <Box
      sx={{
        display: "flex",
        color: "#141414",
        padding: isMobileDevice ? "24px 0px" : "5.5% 10%",
        backgroundImage: isMobileDevice ? "none !important" : "",
        backgroundColor: config?.primaryColor
          ? hexToRGBA(config.primaryColor)
          : hexToRGBA("#0052CD"),
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
