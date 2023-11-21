import * as React from "react"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import { useFormik } from "formik"
import { Container } from "@mui/system"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import LoadingButton from "@mui/lab/LoadingButton"
import { createApp } from "../../http"

export default function CreateApp() {
  const [loading, setLoading] = React.useState(false)
  const fileReference = React.useRef<HTMLInputElement>(null)

  const formik = useFormik({
    initialValues: {
      appName: "",
      appDesctription: "",
      appGoogleId: "",
      defaultAccessProfileOpen: false,
      defaultAccessAssetsOpen: false,
      usersCanFree: false,
      newUserTokenGift: 0,
      coinsDayliBonus: 0,
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
      appDesctription,
      appGoogleId,
      defaultAccessAssetsOpen,
      defaultAccessProfileOpen,
      usersCanFree,
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

      fd.append("appName", appName)
      fd.append("appDesctription", appDesctription)
      fd.append("appGoogleId", appGoogleId)
      fd.append("defaultAccessAssetsOpen", defaultAccessAssetsOpen.toString())
      fd.append("defaultAccessProfileOpen", defaultAccessProfileOpen.toString())
      fd.append("usersCanFree", usersCanFree.toString())

      createApp(fd)
        .then((response) => console.log(response.data))
        .finally(() => setLoading(false))
    },
  })

  return (
    <Container>
      <Box className="title">Craete New App</Box>
      <Box>
        <form onSubmit={formik.handleSubmit}>
          <Box>
            <TextField
              error={
                formik.touched.appName && formik.errors.appName ? true : false
              }
              helperText={
                formik.touched.appName && formik.errors.appName
                  ? formik.errors.appName
                  : ""
              }
              margin="dense"
              label="App Name"
              name="appName"
              variant="standard"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.appName}
            />
          </Box>
          <Box>
            <TextField
              margin="dense"
              label="Google Client Id"
              name="appGoogleId"
              variant="standard"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.appGoogleId}
            />
          </Box>
          <Box style={{ display: "inline-flex", flexDirection: "column" }}>
            <FormControlLabel
              checked={formik.values.defaultAccessProfileOpen}
              name="defaultAccessProfileOpen"
              control={
                <Checkbox
                  onChange={(e) =>
                    formik.setFieldValue(
                      "defaultAccessProfileOpen",
                      e.target.checked
                    )
                  }
                />
              }
              label="defaultAccessProfileOpen"
              labelPlacement="end"
              onChange={formik.handleChange}
            />
            <FormControlLabel
              checked={formik.values.defaultAccessAssetsOpen}
              name="defaultAccessAssetsOpen"
              control={
                <Checkbox
                  onChange={(e) =>
                    formik.setFieldValue(
                      "defaultAccessAssetsOpen",
                      e.target.checked
                    )
                  }
                />
              }
              label="defaultAccessAssetsOpen"
              labelPlacement="end"
            />
            <FormControlLabel
              checked={formik.values.usersCanFree}
              name="usersCanFree"
              control={
                <Checkbox
                  onChange={(e) =>
                    formik.setFieldValue("usersCanFree", e.target.checked)
                  }
                />
              }
              label="usersCanFree"
              labelPlacement="end"
            />

            <input ref={fileReference} type="file" accept="image/*"></input>
            <LoadingButton
              loading={loading}
              variant="contained"
              style={{ marginTop: "15px" }}
              type="submit"
              disabled={loading}
            >
              Create App
            </LoadingButton>
          </Box>
        </form>
      </Box>
    </Container>
  )
}
