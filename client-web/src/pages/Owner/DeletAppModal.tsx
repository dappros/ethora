import * as React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import useMediaQuery from "@mui/material/useMediaQuery"
import LoadingButton from "@mui/lab/LoadingButton"
import { useTheme } from "@mui/material/styles"
import * as http from "../../http"
import { useStoreState } from "../../store"

type TProperties = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  app?: {
    appName: string
    _id: string
  } | null
}

export default function DeletAppModal(properties: TProperties) {
  const [loading, setLoading] = React.useState(false)
  const deleteApp = useStoreState((state) => state.deleteApp)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"))

  const onDelete = () => {
    if (properties.app && properties.app?._id) {
      setLoading(true)
      http
        .deleteApp(properties.app._id)
        .then(() => {
          deleteApp(properties.app?._id as string)
          properties.setOpen(false)
        })
        .finally(() => setLoading(false))
    }
  }

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={properties.open}
        onClose={() => properties.setOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Are you sure want to remove application {properties.app?.appName}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your app clients(mobile, web) will not be able to send requests to
            Platform API after deleting the app
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={loading}
            variant="contained"
            autoFocus
            onClick={() => properties.setOpen(false)}
          >
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            loading={loading}
            color="error"
            onClick={onDelete}
            autoFocus
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  )
}
