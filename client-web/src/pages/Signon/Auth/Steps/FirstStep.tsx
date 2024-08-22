import React, { Dispatch, SetStateAction, useState } from "react"
import { Box, Typography } from "@mui/material"
import { useFormik } from "formik"
import {
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Apple as AppleIcon,
} from "@mui/icons-material"
import CustomButton from "../Button"
import CustomInput from "../Input"
import { registerByEmail } from "../../../../http"
import { useSnackbar } from "../../../../context/SnackbarContext"
import FacebookLogin from "react-facebook-login"

const validate = (values: { email: string; firstName: any; lastName: any }) => {
  const errors: Record<string, string> = {}

  if (!values.email) {
    errors.email = "Required"
  } else if (!/^[\w%+.-]+@[\d.a-z-]+\.[a-z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address"
  }

  if (!values.firstName) {
    errors.firstName = "Required"
  }

  if (!values.lastName) {
    errors.lastName = "Required"
  }

  return errors
}

interface FirstStepProps {
  signUpWithGoogle: () => void
  signUpWithApple: () => void
  signUpWithFacebook: () => void
  signUpWithMetamask: () => void
  setStep: Dispatch<SetStateAction<number>>
}

const FirstStep: React.FC<FirstStepProps> = ({
  signUpWithGoogle,
  signUpWithApple,
  signUpWithFacebook,
  signUpWithMetamask,
  setStep,
}) => {
  const { showSnackbar } = useSnackbar()
  const [errorMessage, setErrorMessage] = useState("")

  const formik = useFormik({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
    validate,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true)
      try {
        const resp = await registerByEmail(
          values.email,
          values.firstName,
          values.lastName
        )
        console.log(resp)
        resetForm()
        showSnackbar(
          "success",
          "Check your e-mail to finish signing up for Ethora"
        )
        setStep((prev) => prev + 1)
      } catch (error) {
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data.errors
        ) {
          const errors = []

          for (const e of error.response.data.errors) {
            if (e.msg) {
              errors.push(e.msg)
            }
          }
          setErrorMessage(errors.join(", "))
          showSnackbar("error", errors.join(", "))
        }
        showSnackbar("error", error.response.data.error)
      }
      setSubmitting(false)
    },
  })

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        onSubmit={formik.handleSubmit}
      >
        <Box sx={{ display: "flex", minWidth: "328px", gap: 3, flex: 1 }}>
          <CustomInput
            placeholder="First Name"
            name="firstName"
            id="firstName"
            fullWidth
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            // helperText={formik.touched.firstName && formik.errors.firstName}
          />
          <CustomInput
            placeholder="Last Name"
            name="lastName"
            id="lastName"
            fullWidth
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            // helperText={formik.touched.lastName && formik.errors.lastName}
          />
        </Box>
        <CustomInput
          fullWidth
          placeholder="Email"
          name="email"
          id="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <CustomButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          loading={formik.isSubmitting}
        >
          Sign Up
        </CustomButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              fontSize: "14px",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: "8px",
              color: "#8C8C8C",
              flexWrap: "wrap",
            }}
          >
            <Typography component="span">
              By clicking the 'Sign Up' button, you agree to our
            </Typography>
            <Typography
              component="a"
              href="/terms"
              sx={{
                textDecoration: "underline",
                color: "blue",
                fontSize: "14px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Terms & Conditions
            </Typography>
          </Box>
        </Box>
        <Typography sx={{ width: "100%", textAlign: "center" }}>or</Typography>
        <CustomButton
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={signUpWithGoogle}
        >
          Continue with Google
        </CustomButton>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <CustomButton
          variant="outlined"
          aria-label="facebook"
          onClick={signUpWithFacebook}
        >
          <FacebookIcon />
        </CustomButton>
        <CustomButton
          variant="outlined"
          aria-label="apple"
          onClick={signUpWithApple}
        >
          <AppleIcon />
        </CustomButton>
        <CustomButton
          variant="outlined"
          aria-label="custom"
          onClick={signUpWithMetamask}
        >
          {/* Replace this with your custom icon */}
          <Box
            component="span"
            sx={{
              display: "inline-block",
              width: 24,
              height: 24,
              backgroundColor: "orange",
              borderRadius: "50%",
            }}
          />
        </CustomButton>
      </Box>
    </Box>
  )
}

export default FirstStep
