import { Box, Typography } from "@mui/material"
import React, { useState } from "react"
import CustomInput from "../../Input"
import CustomButton from "../../Button"
import { useFormik } from "formik"
import { useSnackbar } from "../../../../../context/SnackbarContext"
import { resetPassword } from "../../../../../http"
import { useHistory } from "react-router"

const validate = (values: { newPassword: string; repeatPassword: string }) => {
  const errors: Record<string, string> = {}

  if (!values.newPassword) {
    errors.newPassword = "Required field"
  } else if (values.newPassword.length < 8) {
    errors.newPassword = "Password must be at least 8 characters"
  }

  if (!values.repeatPassword) {
    errors.repeatPassword = "Required field"
  } else if (values.repeatPassword !== values.newPassword) {
    errors.repeatPassword = "Passwords don't match"
  }

  return errors
}

interface ThirdStepProps {}

const ThirdStep: React.FC<ThirdStepProps> = ({}) => {
  const { showSnackbar } = useSnackbar()
  const history = useHistory()

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      repeatPassword: "",
    },
    validate,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true)
      try {
        const resp = await resetPassword(values.newPassword)
        resetForm()
        showSnackbar("success", "Password wassuccessfully reset")
        // setStep((prev) => prev + 1)/
        history.replace("/login")
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
      }}
    >
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        onSubmit={formik.handleSubmit}
      >
        <Typography
          sx={{
            textAlign: "left",
            fontSize: "24px",
            fontWeight: 400,
            color: "#141414",
          }}
        >
          Set your new password
        </Typography>
        <Box
          sx={{
            display: "flex",
            minWidth: "328px",
            gap: 3,
            flex: 1,
            flexDirection: "column",
          }}
        >
          <CustomInput
            placeholder="Enter New Password"
            name="newPassword"
            type="password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.newPassword && Boolean(formik.errors.newPassword)
            }
            helperText={formik.touched.newPassword && formik.errors.newPassword}
            sx={{ flex: 1, width: "100%" }}
          />
          <CustomInput
            placeholder="Repeat New Password"
            name="repeatPassword"
            type="password"
            value={formik.values.repeatPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.repeatPassword &&
              Boolean(formik.errors.repeatPassword)
            }
            helperText={
              formik.touched.repeatPassword && formik.errors.repeatPassword
            }
            sx={{ flex: 1, width: "100%" }}
          />
        </Box>
        <CustomButton
          fullWidth
          variant="contained"
          color="primary"
          disabled={formik.isSubmitting}
          loading={formik.isSubmitting}
        >
          Reset password
        </CustomButton>
      </Box>
    </Box>
  )
}

export default ThirdStep
