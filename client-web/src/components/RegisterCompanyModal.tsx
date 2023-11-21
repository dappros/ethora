import React, { useState } from "react"
import { LoadingButton } from "@mui/lab"
import {
  Dialog,
  Box,
  DialogTitle,
  IconButton,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
  Button,
  Typography,
} from "@mui/material"
import { useFormik } from "formik"
import { agreeWithTerms } from "../http"
import Tnc from "../pages/Signon/Tnc"
import { useStoreState } from "../store"
import CloseIcon from "@mui/icons-material/Close"
import { useSnackbar } from "../context/SnackbarContext"

export interface IRegisterCompanyModal {
  open: boolean
  onClose: () => void
  afterSubmit?: () => void
}

export const RegisterCompanyModal: React.FC<IRegisterCompanyModal> = ({
  open,
  onClose,
  afterSubmit,
}) => {
  const user = useStoreState((state) => state.user)
  const setUser = useStoreState((state) => state.setUser)

  const [termsOpen, setTermsOpen] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const { showSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const formik = useFormik({
    initialValues: {
      companyName: "",
    },
    onSubmit: async ({ companyName }) => {
      setLoading(true)
      try {
        const res = await agreeWithTerms(companyName)
        setUser({ ...user, isAgreeWithTerms: true })
        onClose()
        afterSubmit()
      } catch (error) {
        console.log(error)
        showSnackbar("error", "Something went wrong")
      }
      setLoading(false)
    },
  })
  return (
    <Dialog onClose={onClose} maxWidth={false} open={open}>
      <Box style={{ width: "600px" }}>
        <IconButton
          sx={{ position: "absolute", top: 0, right: 0 }}
          disabled={loading}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingLeft: 1,
          }}
        >
          Entity Registration
        </DialogTitle>
        <Box sx={{ width: "100%", typography: "body1", padding: 1 }}>
          <form onSubmit={formik.handleSubmit}>
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
            <Typography sx={{ fontSize: 10 }}>
              Please add a name of your entity, such as your registered company
              name. If you don't have a formal entity, simply add your startup
              or team name. This is needed so that your Applications and assets
              can be assigned to a group. You will be able to change the group
              entity name and manage its members later .
            </Typography>

            <FormGroup>
              <FormControlLabel
                value={"I agree to the Terms & Conditions"}
                control={
                  <Checkbox
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                }
                label={
                  <p>
                    I agree to the{" "}
                    <span
                      onClick={(e) => {
                        setTermsOpen(true)
                      }}
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                    >
                      Terms & Conditions
                    </span>
                  </p>
                }
                labelPlacement="end"
              />
            </FormGroup>
            {/* <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Typography
                onClick={(e) => {
                  setTermsOpen(true);
                }}
                sx={{
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: 10,
                }}
              >
                Terms and Conditions
              </Typography>
            </Box> */}
            {!!error && <Alert severity="error">{error}</Alert>}
            <Box sx={{ margin: 2, display: "flex", justifyContent: "center" }}>
              <LoadingButton
                loading={loading}
                variant="contained"
                type="submit"
                disabled={loading || !termsAccepted}
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
            firstName={user.firstName}
            lastName={user.lastName}
            email={user.lastName}
            company="company"
          />
        </Box>
      </Dialog>
    </Dialog>
  )
}
