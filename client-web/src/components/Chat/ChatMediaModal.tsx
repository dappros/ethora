import React from "react"
import Box from "@mui/material/Box"

import Modal from "@mui/material/Modal"
import { TCombinedMimeType } from "../../constants"
import { IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
}

interface IChatMediaModal {
  open: boolean
  onClose: () => void
  mimetype: TCombinedMimeType
  url: string
}

export const ChatMediaModal: React.FC<IChatMediaModal> = ({
  open,
  onClose,
  mimetype,
  url,
}) => {
  const renderMediaContent = () => {
    switch (mimetype) {
      case "image/jpeg":
      case "image/png":
      case "image/jpg": {
        return (
          <img
            src={url}
            alt={"image1"}
            style={{ maxWidth: "100%", maxHeight: "90vh" }}
          />
        )
      }

      default: {
        return null
      }
    }
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 0, right: 0, color: "black" }}
        >
          <CloseIcon />
        </IconButton>
        {renderMediaContent()}
      </Box>
    </Modal>
  )
}
