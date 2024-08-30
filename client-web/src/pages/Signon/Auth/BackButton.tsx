import React from "react"
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace"
import { IconButton } from "@mui/material"

interface BackButtonProps {
  onPress: () => void
  buttonColor?: string
}

const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  buttonColor = "#8C8C8C",
}) => {
  const hadleClick = (event: any): void => {
    event.preventDefault()
    onPress?.()
  }

  return (
    <IconButton
      onClick={hadleClick}
      sx={{
        position: "absolute",
        top: "4px",
        left: "0px",
        borderRadius: "2px",
        width: "24px",
        height: "24px",
      }}
    >
      <KeyboardBackspaceIcon sx={{ color: buttonColor }} />
    </IconButton>
  )
}

export default BackButton
