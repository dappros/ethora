import React, { useState } from "react"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import { useFormik } from "formik"
import TextField from "@mui/material/TextField"
import { useStoreState } from "../../store"
import LoadingButton from "@mui/lab/LoadingButton"
import * as http from "../../http"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import { Button, Typography } from "@mui/material"
import { useSnackbar } from "../../context/SnackbarContext"

type TProperties = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function NewAppModal({ open, setOpen }: TProperties) {
  const fileReference = React.useRef<HTMLInputElement>(null)
  const setApp = useStoreState((state) => state.setApp)
  const setUser = useStoreState((state) => state.setUser)
  const user = useStoreState((state) => state.user)

  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string>("")
  const { showSnackbar } = useSnackbar()
  const formik = useFormik({
    initialValues: {
      appName: "",
      appDescription: "",
      appGoogleId: "",
      defaultAccessProfileOpen: true,
      defaultAccessAssetsOpen: true,
      usersCanFree: true,
      newUserTokenGift: 0,
      coinsDayliBonus: 0,
      appUrl: "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {}

      if (!values.appName) {
        errors.appName = "Required"
      }

      return errors
    },
    onSubmit: ({
      appName,
      appDescription,
      appGoogleId,
      defaultAccessAssetsOpen,
      defaultAccessProfileOpen,
      usersCanFree,
      appUrl,
    }) => {
      setLoading(true)
      const fd = new FormData()
      let file
      if (fileReference.current) {
        const files = fileReference.current.files
        if (files) {
          file = files[0]
        }
      }

      if (file) {
        fd.append("file", file)
      }
      fd.append("displayName", appName)
      appDescription && fd.append("appDescription", appDescription.toString())
      appGoogleId && fd.append("appGoogleId", appGoogleId.toString())
      fd.append("defaultAccessAssetsOpen", defaultAccessAssetsOpen.toString())
      fd.append("defaultAccessProfileOpen", defaultAccessProfileOpen.toString())
      fd.append("usersCanFree", usersCanFree.toString())
      appUrl && fd.append("appUrl", appUrl.toString())

      http
        .createApp(fd)
        .then((response) => {
          setApp(response.data.app)
          setOpen(false)
          setUser({ ...user, homeScreen: "" })
        })
        .catch((error) => {
          showSnackbar(
            "error",
            "Cannot create the app " + (error.response?.data?.error || "")
          )
        })
        .finally(() => setLoading(false))
    },
  })

  const onImage = (event: any) => {
    const input = event.target as HTMLInputElement

    if (input.files) {
      const reader = new FileReader()

      reader.addEventListener("load", (e) => {
        if (e && e.target?.result) {
          setPreview(e.target.result as string)
        }
      })
      reader.readAsDataURL(input.files[0])
    }
  }
  const onClose = () => {
    setOpen(false)
    setPreview("")
  }
  return (
    <Dialog onClose={onClose} open={open}>
      <Box sx={{ padding: 1 }}>
        <IconButton
          sx={{ position: "absolute", top: 0, right: 0 }}
          disabled={loading}
          onClick={() => setOpen(false)}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle sx={{ padding: 1 }}>New App</DialogTitle>
        <Box sx={{ width: "100%", padding: 1 }}>
          <form onSubmit={formik.handleSubmit} style={{ width: "300px" }}>
            <Box>
              <TextField
                fullWidth
                error={!!formik.touched.appName && !!formik.errors.appName}
                margin="dense"
                label="App Name"
                name="appName"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.appName}
              />
            </Box>
            {/* <Box>
              <TextField
                sx={{ width: "100%" }}
                margin="dense"
                label="Google Client Id"
                name="appGoogleId"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.appGoogleId}
              />
            </Box> */}
            {/* <Box>
              <TextField
                sx={{ width: "100%" }}
                margin="dense"
                label="App Url"
                name="appUrl"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.appUrl}
                error={!!formik.touched.appUrl && !!formik.errors.appUrl}
              />
            </Box> */}

            <LoadingButton
              loading={loading}
              variant="contained"
              style={{ marginTop: "15px", width: "100%" }}
              type="submit"
              disabled={loading}
            >
              Create App
            </LoadingButton>
          </form>
        </Box>
      </Box>
    </Dialog>
  )
}
