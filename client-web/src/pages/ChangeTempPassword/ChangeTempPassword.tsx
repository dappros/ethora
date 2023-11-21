import React, { useEffect, useMemo, useState } from "react"
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material"
import { useHistory, useLocation, useParams } from "react-router"
import { httpWithToken } from "../../http"
import { config } from "../../config"
import { useSnackbar } from "../../context/SnackbarContext"
import { FullPageSpinner } from "../../components/FullPageSpinner"
import { VisibilityOff, Visibility, ErrorRounded } from "@mui/icons-material"
import { LoadingButton } from "@mui/lab"
import { FormikErrors, FormikValues, useFormik } from "formik"

export interface IChangeTemporaryPassword {}
export interface IResetPassword {}
interface FormValues {
  password: string
  repeatedPassword: string
}

const validate = (values: FormikValues): FormikErrors<FormValues> => {
  const errors: FormikErrors<FormValues> = {}

  if (!values.tempPassword) {
    errors.repeatedPassword = "Must be 6 characters or more"
  }
  if (!values.password) {
    errors.password = ""
  } else if (values.password.length <= 6) {
    errors.password = "Must be 6 characters or more"
  }
  if (!values.repeatedPassword) {
    errors.repeatedPassword = ""
  } else if (values.repeatedPassword.length <= 6) {
    errors.repeatedPassword = "Must be 6 characters or more"
  }

  if (values.password !== values.repeatedPassword) {
    errors.repeatedPassword =
      "Your new password and repeat password should match"
  }

  return errors
}
export const ChangeTempPassword: React.FC<IChangeTemporaryPassword> = ({}) => {
  const { search } = useLocation()

  const searchParameters = useMemo(() => new URLSearchParams(search), [search])
  const email = searchParameters.get("email")
  const temporaryPassword = searchParameters.get("tempPassword")

  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatedPassword, setShowRepeatedPassword] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const history = useHistory()
  const { showSnackbar } = useSnackbar()
  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleClickShowRepeatedPassword = () =>
    setShowRepeatedPassword((show) => !show)

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
  }

  const formik = useFormik({
    initialValues: {
      tempPassword: temporaryPassword,
      password: "",
      repeatedPassword: "",
    },
    initialErrors: {
      tempPassword: "",
      password: "",
      repeatedPassword: "",
    },
    validate,

    onSubmit: async ({ password, tempPassword }, { setSubmitting }) => {
      setSubmitting(true)
      try {
        const res = await httpWithToken("1").post(
          "/users/set-permanent-password-with-temp-password",
          {
            tempPassword,
            password: password,
          }
        )
        history.push({ pathname: "/signIn", search: `?email=${email}` })
        showSnackbar("success", "Password changed successfully")
      } catch (error) {
        showSnackbar(
          "error",
          "Cannot change password " + error?.response?.data?.error || ""
        )
      }
      setSubmitting(false)
    },
  })

  if (isLoading) {
    return <FullPageSpinner />
  }

  return (
    <Container
      maxWidth="xl"
      style={{ height: "calc(100vh - 68px)", paddingTop: "20px" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>
            Thank you for confirming your e-mail! Just specify a permanent
            password now and you'll be all set!
          </Typography>
          <form
            onSubmit={formik.handleSubmit}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              minWidth: 300,
              maxWidth: "50vw",
            }}
          >
            <FormControl sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-tempPassword">
                Temporary Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-tempPassword"
                name="tempPassword"
                label={"Temporary Password"}
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.tempPassword}
                error={
                  !!formik.touched.tempPassword && !!formik.errors.tempPassword
                }
              />
            </FormControl>
            <FormControl sx={{ width: "100%", mt: 2 }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                name="password"
                label={"Password"}
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                type={showPassword ? "text" : "password"}
                error={!!formik.touched.password && !!formik.errors.password}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <FormControl sx={{ width: "100%", mt: 2 }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-repeatedpassword">
                Repeat Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-repeatedpassword"
                name="repeatedPassword"
                label="Repeat Password"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.repeatedPassword}
                type={showRepeatedPassword ? "text" : "password"}
                error={
                  !!formik.touched.repeatedPassword &&
                  !!formik.errors.repeatedPassword
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowRepeatedPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {formik.touched.repeatedPassword &&
                !!formik.errors.repeatedPassword && (
                  <FormHelperText>
                    {formik.errors.repeatedPassword as string}
                  </FormHelperText>
                )}
            </FormControl>
            <LoadingButton
              loading={formik.isSubmitting}
              variant="contained"
              type={"submit"}
              sx={{ marginTop: 2 }}
            >
              Change Password
            </LoadingButton>
          </form>
        </Box>
      </Box>
    </Container>
  )
}
