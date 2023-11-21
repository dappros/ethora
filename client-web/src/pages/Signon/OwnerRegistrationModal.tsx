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
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import FormGroup from "@mui/material/FormGroup"
import Tnc from "./Tnc"
import LoadingButton from "@mui/lab/LoadingButton"
import Alert from "@mui/material/Alert"
import * as http from "../../http"
import { getTnc } from "../../utils"

type TProperties = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const validate = (values: Record<string, string>) => {
  const errors: Record<string, string> = {}

  if (!values.firstName) {
    errors.firstName = "Required"
  }

  if (!values.lastName) {
    errors.lastName = "Required"
  }

  if (!values.email) {
    errors.email = "Required"
  } else if (!/^[\w%+.-]+@[\d.a-z-]+\.[a-z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address"
  }

  return errors
}

export function OwnerRegistration({ open, setOpen }: TProperties) {
  const setOwner = useStoreState((state) => state.setOwner)
  const history = useHistory()
  const [termsOpen, setTermsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      companyName: "",
    },
    validate,
    onSubmit: ({ firstName, lastName, email, companyName }) => {
      setLoading(true)
      http
        .registerOwner(
          firstName,
          lastName,
          email,
          companyName,
          getTnc(
            companyName,
            firstName,
            lastName,
            email,
            new Date().toDateString()
          )
        )
        .then((result) => {
          const data = result.data

          setOwner({
            ...data.user,
            token: data.token,
          })
          history.push("/owner")
          setOpen(false)
        })
        .catch((error) => {
          if (error.response && error.response.status === 409) {
            setError(error.response.data)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    },
  })

  return (
    <Dialog onClose={() => setOpen(false)} maxWidth={false} open={open}>
      <Box style={{ width: "400px" }}>
        <DialogTitle
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          Owner Registration
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
              label="First Name*"
              name="firstName"
              type="text"
              fullWidth
              variant="standard"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              helperText={
                formik.touched.firstName && formik.errors.firstName
                  ? formik.errors.firstName
                  : ""
              }
            />
            <TextField
              margin="dense"
              label="Last Name*"
              name="lastName"
              type="text"
              fullWidth
              inputProps={{
                autoComplete: "off",
              }}
              variant="standard"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={
                formik.touched.lastName && formik.errors.lastName
                  ? formik.errors.lastName
                  : ""
              }
            />
            <TextField
              margin="dense"
              label="Email*"
              name="email"
              type="text"
              fullWidth
              inputProps={{
                autoComplete: "off",
              }}
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
            <TextField
              margin="dense"
              label="Company Name"
              name="companyName"
              type="text"
              fullWidth
              inputProps={{
                autoComplete: "off",
              }}
              variant="standard"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.companyName && Boolean(formik.errors.companyName)
              }
              helperText={
                formik.touched.companyName && formik.errors.companyName
                  ? formik.errors.companyName
                  : ""
              }
            />
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                setTermsOpen(true)
              }}
            >
              Terms and Conditions
            </a>
            <FormGroup>
              <FormControlLabel
                value="I agree to the above terms and conditions"
                checked={true}
                control={<Checkbox />}
                label="I agree to the above terms and conditions"
                labelPlacement="end"
              />
            </FormGroup>
            {!!error && <Alert severity="error">{error}</Alert>}
            <Box sx={{ margin: 2, display: "flex", justifyContent: "center" }}>
              <LoadingButton
                loading={loading}
                variant="contained"
                type="submit"
                disabled={loading}
              >
                Register
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </Box>
      <Dialog
        onClose={() => setTermsOpen(false)}
        maxWidth={false}
        open={termsOpen}
      >
        <Box sx={{ width: 800 }}>
          <Tnc
            setTermsOpen={(isOpen: boolean) => setTermsOpen(isOpen)}
            firstName={formik.values.firstName}
            lastName={formik.values.lastName}
            email={formik.values.email}
            company="company"
          ></Tnc>
        </Box>
      </Dialog>
    </Dialog>
  )
}
