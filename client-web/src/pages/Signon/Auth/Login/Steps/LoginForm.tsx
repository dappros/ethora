import React from "react"
import { Box, Typography } from "@mui/material"
import CustomInput from "../../Input"
import CustomButton from "../../Button"
import GoogleIcon from "../../../Icons/socials/googleIcon"
import FacebookIcon from "../../../Icons/socials/facebookIcon"
import AppleIcon from "../../../Icons/socials/appleIcon"
import MetamaskIcon from "../../../Icons/socials/metamaskIcon"
import { useFormik } from "formik"
import { TLoginSuccessResponse, loginEmail } from "../../../../../http"
import { useHistory } from "react-router-dom"
import { useSnackbar } from "../../../../../context/SnackbarContext"

const validate = (values: Record<string, string>) => {
  const errors: Record<string, string> = {}

  if (!values.email) {
    errors.email = "Required field"
  } else if (!/^[\w%+.-]+@[\d.a-z-]+\.[a-z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address"
  }

  if (!values.password) {
    errors.password = "Required field"
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters"
  }

  return errors
}

type TProperties = {
  updateUser: (data: TLoginSuccessResponse) => void
  signInWithGoogle: () => void
  signInWithMetamask: () => void
}

const LoginStep: React.FC<TProperties> = ({
  updateUser,
  signInWithGoogle,
  signInWithMetamask,
}) => {
  const [disableSubmit, setDisableSubmit] = React.useState(false)

  const history = useHistory()
  const { showSnackbar } = useSnackbar()

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: async (values, { resetForm }) => {
      setDisableSubmit(true)
      loginEmail(values.email, values.password)
        .then((result) => {
          updateUser(result.data)
          resetForm()
        })
        .catch((error) => {
          console.error(error)
          showSnackbar("error", "HTTP Error")

          if (
            error.response &&
            (error.response.status === 404 || error.response.status === 401)
          ) {
            showSnackbar("error", "Wrong credentials")
          }
        })
        .finally(() => {
          setDisableSubmit(false)
        })
    },
  })

  const setForgetQuery = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()
    history.push("forgetPassword")
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        minWidth: "320px",
      }}
    >
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        noValidate
        autoComplete="off"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          flexWrap: "wrap",
        }}
      >
        <CustomInput
          fullWidth
          placeholder={"Email"}
          type="email"
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <CustomInput
          fullWidth
          placeholder={"Password"}
          type="password"
          name="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Typography
          style={{
            textDecoration: "underline",
            color: "#0052CD",
            fontSize: "14px",
            display: "inline",
            cursor: "pointer",
          }}
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
            setForgetQuery(e)
          }
        >
          Forgot password ?
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "27px",
          width: "100%",
        }}
      >
        <CustomButton
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          disabled={disableSubmit}
          loading={disableSubmit}
          onClick={() => formik.submitForm()}
        >
          Sign In
        </CustomButton>
        <Typography
          sx={{ width: "100%", textAlign: "center", color: "#8C8C8C" }}
        >
          or
        </Typography>
        <CustomButton
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={signInWithGoogle}
        >
          Continue with Google
        </CustomButton>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        {/* <CustomButton variant="outlined" aria-label="facebook">
          <FacebookIcon />
        </CustomButton>
        <CustomButton variant="outlined" aria-label="apple">
          <AppleIcon />
        </CustomButton> */}
        <CustomButton
          variant="outlined"
          aria-label="metamask"
          onClick={signInWithMetamask}
        >
          <MetamaskIcon />
        </CustomButton>
      </Box>
    </Box>
  )
}

export default LoginStep
