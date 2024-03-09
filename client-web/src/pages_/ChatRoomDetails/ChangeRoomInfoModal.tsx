import { Box, Button, Modal, TextField, Typography } from "@mui/material"

interface IChangeRoomModal {
  title: string
  open: boolean
  onClose: () => void
  onChange: (info: string) => void
  onSubmit: () => void
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  justifyContent: "center",
  display: "flex",
  flexDirection: "column",
  borderRadius: "10px",
}

export function ChangeRoomInfoModal({
  title,
  open,
  onClose,
  onChange,
  onSubmit,
}: IChangeRoomModal) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <TextField
          onChange={(e) => onChange(e.target.value)}
          margin="normal"
          id="outlined-basic"
          label="Enter new info here"
          variant="outlined"
        />
        <Button
          onClick={onSubmit}
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
          variant="contained"
        >
          <Typography id="modal-modal-description">Submit</Typography>
        </Button>
      </Box>
    </Modal>
  )
}
