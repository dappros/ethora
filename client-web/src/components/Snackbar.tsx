import { Alert, Snackbar as MuiSnackbar } from "@mui/material"
import { useSnackbar } from "../context/SnackbarContext"

export const Snackbar = () => {
  const { snackbar, closeSnackbar } = useSnackbar()

  return (
    <MuiSnackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={closeSnackbar}
    >
      <Alert
        onClose={closeSnackbar}
        severity={snackbar.action}
        sx={{ width: "100%" }}
      >
        {snackbar.message}
      </Alert>
    </MuiSnackbar>
  )
}
