import React from "react"
import { Box, Typography } from "@mui/material"
import CustomInput from "../Input"
import CustomButton from "../Button"
import GoogleIcon from "../../Icons/socials/googleIcon"
import FacebookIcon from "../../Icons/socials/facebookIcon"
import AppleIcon from "../../Icons/socials/appleIcon"
import MetamaskIcon from "../../Icons/socials/metamaskIcon"
import { useFormik } from "formik"
import { TLoginSuccessResponse, loginUsername } from "../../../../http"

const validate = (values: Record<string, string>) => {
  const errors: Record<string, string> = {}

  if (!values.email) {
    errors.email = "Required"
  }

  if (!values.password) {
    errors.password = "Required"
  } else if (values.password.length <= 2) {
    errors.password = "Must be 2 characters or more"
  }

  return errors
}

type TProperties = {
  closeModal: () => void
  updateUser: (data: TLoginSuccessResponse) => void
}

const LoginStep: React.FC<TProperties> = ({ closeModal, updateUser }) => {
  const [disableSubmit, setDisableSubmit] = React.useState(false)
  const [httpError, setHttpError] = React.useState("")

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: (values) => {
      setDisableSubmit(true)
      loginUsername(values.email, values.password)
        .then((result) => {
          updateUser(result.data)
          closeModal()
        })
        .catch((error) => {
          console.error(error)
          setHttpError("HTTP Error")
          if (
            error.response &&
            (error.response.status === 404 || error.response.status === 401)
          ) {
            setHttpError("Wrong credentials")
          }
        })
        .finally(() => {
          setDisableSubmit(false)
        })
    },
  })

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        noValidate
        autoComplete="off"
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
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
          component="a"
          href="/forgot-password"
          style={{
            textDecoration: "underline",
            color: "#0052CD",
            fontSize: "14px",
            display: "inline",
          }}
        >
          Forgot password ?
        </Typography>
        {httpError && (
          <Typography sx={{ color: "error.main" }} component="p">
            {httpError}
          </Typography>
        )}
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
        >
          Sign In
        </CustomButton>
        <Typography
          sx={{ width: "100%", textAlign: "center", color: "#8C8C8C" }}
        >
          or
        </Typography>
        <CustomButton fullWidth variant="outlined" startIcon={<GoogleIcon />}>
          Continue with Google
        </CustomButton>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <CustomButton variant="outlined" aria-label="facebook">
          <FacebookIcon />
        </CustomButton>
        <CustomButton variant="outlined" aria-label="apple">
          <AppleIcon />
        </CustomButton>
        <CustomButton variant="outlined" aria-label="metamask">
          <MetamaskIcon />
        </CustomButton>
      </Box>
    </Box>
  )
}

export default LoginStep
