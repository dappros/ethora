import React, { useState } from "react"
import {
  Box,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material"
import { FormikErrors, FormikValues, useFormik } from "formik"
import { useHistory, useParams } from "react-router"
import { LoadingButton } from "@mui/lab"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import { httpWithToken } from "../../http"
import { config } from "../../config"
import { useSnackbar } from "../../context/SnackbarContext"
import { useStoreState } from "../../store"

export interface IResetPassword {}
interface FormValues {
  password: string
  repeatedPassword: string
}

const validate = (values: FormikValues): FormikErrors<FormValues> => {
  const errors: FormikErrors<FormValues> = {}

  if (!values.password) {
    errors.password = ""
  } else if (values.password.length <= 3) {
    errors.password = "Must be 3 characters or more"
  }
  if (!values.repeatedPassword) {
    errors.repeatedPassword = ""
  } else if (values.repeatedPassword.length <= 3) {
    errors.repeatedPassword = "Must be 3 characters or more"
  }

  if (values.password !== values.repeatedPassword) {
    errors.repeatedPassword = "Value must be equal to password"
  }

  return errors
}
export const ResetPassword: React.FC<IResetPassword> = ({}) => {
  const { token } = useParams<{ token: string }>()
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatedPassword, setShowRepeatedPassword] = useState(false)
  const history = useHistory()
  const { showSnackbar } = useSnackbar()
  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleClickShowRepeatedPassword = () =>
    setShowRepeatedPassword((show) => !show)
  const appToken = useStoreState((s) => s.config.appToken)

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
  }

  const formik = useFormik({
    initialValues: {
      password: "",
      repeatedPassword: "",
    },
    initialErrors: {
      password: "",
      repeatedPassword: "",
    },
    validate,

    onSubmit: async ({ password }, { setSubmitting }) => {
      setSubmitting(true)
      try {
        const res = await httpWithToken(appToken).post("/users/reset", {
          token,
          password: password,
        })
        console.log(res.data)
        history.push("/")
        showSnackbar("success", "Password changed successfully")
      } catch (error) {
        console.log(error)
        showSnackbar("error", "Cannot change password")
      }
      setSubmitting(false)
    },
  })

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
            Reset Password
          </LoadingButton>
        </form>
      </Box>
    </Container>
  )
}
