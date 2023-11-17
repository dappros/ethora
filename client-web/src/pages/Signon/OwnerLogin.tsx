import React, { useState } from "react"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import { useFormik } from "formik"
import TextField from "@mui/material/TextField"
import { useHistory } from "react-router-dom"
import { useStoreState } from "../../store"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import FormHelperText from "@mui/material/FormHelperText"
import Input from "@mui/material/Input"
import InputAdornment from "@mui/material/InputAdornment"
import LoadingButton from "@mui/lab/LoadingButton"
import Alert from "@mui/material/Alert"
import * as http from "../../http"

type TProperties = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const validate = (values: Record<string, string>) => {
  const errors: Record<string, string> = {}

  if (!values.email) {
    errors.email = "Required"
  } else if (!/^[\w%+.-]+@[\d.a-z-]+\.[a-z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address"
  }

  if (!values.password) {
    errors.password = "Required"
  }

  return errors
}

export default function OwnerLogin({ open, setOpen }: TProperties) {
  const [showPassword, setShowPassword] = useState(false)
  const setOwner = useStoreState((state) => state.setOwner)
  const setApps = useStoreState((state) => state.setApps)
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: ({ email, password }) => {
      setLoading(true)
      http
        .loginOwner(email, password)
        .then((response) => {
          setOwner({
            firstName: response.data.user.firstName,
            lastName: response.data.user.lastName,
            token: response.data.token,
            _id: response.data.user._id,
            walletAddress: response.data.user.defaultWallet.walletAddress,
            ACL: response.data.user.ACL,
            isAllowedNewAppCreate: response.data.isAllowedNewAppCreate,
            isAgreeWithTerms: response.data.user.isAgreeWithTerms,
            homeScreen: response.data.user.homeScreen,
          })
          setApps(response.data.apps)
          history.push("/owner")
        })
        .catch((error) => {
          console.log("error", error)
        })
        .finally(() => setLoading(false))
    },
  })

  return (
    <Dialog onClose={() => setOpen(false)} maxWidth={false} open={open}>
      <Box style={{ width: "400px" }}>
        <DialogTitle
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          Owner Login
          <IconButton disabled={loading} onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box sx={{ width: "100%", typography: "body1", padding: 1 }}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              margin="dense"
              inputProps={{
                autoComplete: "off",
              }}
              label="Email*"
              name="email"
              type="text"
              fullWidth
              variant="standard"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={
                formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : ""
              }
            />
            <FormControl
              error={formik.touched.password && Boolean(formik.errors.password)}
              fullWidth
              variant="standard"
            >
              <InputLabel htmlFor="standard-adornment-password">
                Password
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={showPassword ? "text" : "password"}
                fullWidth
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((show) => !show)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {formik.touched.password && formik.errors.password && (
                <FormHelperText>{formik.errors.password}</FormHelperText>
              )}
            </FormControl>
            {!!error && <Alert severity="error">{error}</Alert>}
            <Box sx={{ margin: 2, display: "flex", justifyContent: "center" }}>
              <LoadingButton
                loading={loading}
                variant="contained"
                type="submit"
                disabled={loading}
              >
                Login
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </Box>
    </Dialog>
  )
}
