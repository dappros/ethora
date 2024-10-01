import React, { Dispatch, SetStateAction, useState } from "react"
import { Box, Typography } from "@mui/material"
import { useFormik } from "formik"
import GoogleIcon from "../../../Icons/socials/googleIcon"
import FacebookIcon from "../../../Icons/socials/facebookIcon"
import AppleIcon from "../../../Icons/socials/appleIcon"
import MetamaskIcon from "../../../Icons/socials/metamaskIcon"
import CustomButton from "../../Button"
import CustomInput from "../../Input"
import { registerByEmail } from "../../../../../http"
import { useSnackbar } from "../../../../../context/SnackbarContext"
import FacebookLogin from "react-facebook-login"
import SkeletonLoader from "../../../SkeletonLoader"
import { useHistory } from "react-router"
import { useStoreState } from "../../../../../store"

const validate = (values: { email: string; firstName: any; lastName: any }) => {
  const errors: Record<string, string> = {}

  if (!values.email) {
    errors.email = "Required field"
  } else if (!/^[\w%+.-]+@[\d.a-z-]+\.[a-z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address"
  }

  if (!values.firstName) {
    errors.firstName = "Required field"
  } else if (values.firstName.length < 2) {
    errors.firstName = "First name must be at least 2 characters"
  }

  if (!values.lastName) {
    errors.lastName = "Required field"
  } else if (values.lastName.length < 2) {
    errors.lastName = "Last name must be at least 2 characters"
  }

  return errors
}

interface FirstStepProps {
  signUpWithGoogle: () => void
  signUpWithApple: () => void
  signUpWithFacebook: (info: any) => void
  signUpWithMetamask: () => void
  setStep: Dispatch<SetStateAction<number>>
  loading: boolean
  isSmallDevice?: boolean
}

const FirstStep: React.FC<FirstStepProps> = ({
  signUpWithGoogle,
  signUpWithApple,
  signUpWithFacebook,
  signUpWithMetamask,
  setStep,
  loading = false,
  isSmallDevice = false,
}) => {
  const { showSnackbar } = useSnackbar()
  const history = useHistory()
  const config = useStoreState((state) => state.config)

  const setEmailQuery = (email: string) => {
    const params = new URLSearchParams(location.search)
    params.set("email", email)
    history.push({ search: params.toString() })
  }

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
        setEmailQuery(values.email)
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
          showSnackbar("error", errors.join(", "))
        }
        showSnackbar("error", error.response.data.error)
      }
      setSubmitting(false)
    },
  })

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        minWidth: "320px",
      }}
    >
      <SkeletonLoader loading={loading}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            flexWrap: "wrap",
          }}
          onSubmit={formik.handleSubmit}
        >
          <Box
            sx={{
              display: "flex",
              minWidth: "320px",
              gap: 3,
              flex: 1,
              flexWrap: isSmallDevice ? "wrap" : "nowrap",
            }}
          >
            <CustomInput
              placeholder="First Name"
              name="firstName"
              id="firstName"
              fullWidth
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              helperText={
                formik.touched.firstName && formik.errors.firstName
                  ? String(formik.errors.firstName)
                  : ""
              }
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
              helperText={
                formik.touched.lastName && formik.errors.lastName
                  ? String(formik.errors.lastName)
                  : ""
              }
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
            disabled={formik.isSubmitting}
            style={{
              backgroundColor: config?.primaryColor
                ? config.primaryColor
                : "#0052CD",
            }}
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
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: "8px",
                color: "#8C8C8C",
                flexWrap: "wrap",
                maxWidth: "486px",
                fontSize: "14px",
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: "inherit",
                  color: "inherit",
                  flexWrap: "wrap",
                }}
              >
                By clicking the 'Sign Up' button, you agree to our
              </Typography>
              <Typography
                component="a"
                href="/terms"
                sx={{
                  textDecoration: "underline",
                  color: config?.primaryColor ? config.primaryColor : "#0052CD",
                  fontSize: "inherit",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Terms & Conditions
              </Typography>
            </Box>
          </Box>
          {config?.signonOptions.length > 1 && (
            <Typography
              sx={{ width: "100%", textAlign: "center", color: "#8C8C8C" }}
            >
              or
            </Typography>
          )}
          {config?.signonOptions.includes("google") && (
            <CustomButton
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={signUpWithGoogle}
              style={{
                borderColor: config?.primaryColor
                  ? config.primaryColor
                  : "#0052CD",

                color: config?.primaryColor ? config.primaryColor : "#0052CD",
              }}
            >
              Continue with Google
            </CustomButton>
          )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          {/* <CustomButton
            variant="outlined"
            aria-label="facebook"
            onClick={signUpWithFacebook}
          >
            <FacebookIcon />
          </CustomButton> */}
          {/* <FacebookLogin
            aria-label="facebook"
            appId="1172938123281314"
            autoLoad={false}
            fields="name,email,picture"
            callback={signUpWithFacebook}
            icon={<FacebookIcon />}
            buttonStyle={{
              borderRadius: "16px",
              padding: "12px 16px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              fontFamily: "Varela Round",
              fontSize: "16px",
              textAlign: "center",
              flex: 1,
              backgroundColor: "#FFFFFF",
              color: "#0052CD",
              border: "1px solid #0052CD",
              height: "48px",
              width: "100%",
            }}
            textButton={""}
            containerStyle={{ flex: 1, width: "100%" }}
          /> */}
          {/* <CustomButton
            variant="outlined"
            aria-label="apple"
            onClick={signUpWithApple}
          >
            <AppleIcon />
          </CustomButton> */}
          {config?.signonOptions.includes("metamask") && (
            <CustomButton
              variant="outlined"
              aria-label="metamask"
              onClick={signUpWithMetamask}
              style={{
                backgroundColor: config?.primaryColor
                  ? config.primaryColor
                  : "#0052CD",
                borderColor: config?.secondaryColor
                  ? config.secondaryColor
                  : "#0052CD",
                color: "white",
              }}
            >
              <MetamaskIcon />
              {config?.signonOptions.length < 8 && "Continue with Metamask"}
            </CustomButton>
          )}
        </Box>
      </SkeletonLoader>
    </Box>
  )
}

export default FirstStep
