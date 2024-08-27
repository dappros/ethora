import React, { Dispatch, SetStateAction } from "react"
import { Box, Typography } from "@mui/material"
import { useFormik } from "formik"
import CustomButton from "../../Button"
import CustomInput from "../../Input"
import { registerByEmail } from "../../../../../http"
import { useSnackbar } from "../../../../../context/SnackbarContext"
import SkeletonLoader from "../../../SkeletonLoader"

const validate = (values: { email: string; firstName: any; lastName: any }) => {
  const errors: Record<string, string> = {}

  if (!values.email) {
    errors.email = "Required"
  } else if (!/^[\w%+.-]+@[\d.a-z-]+\.[a-z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address"
  }

  return errors
}

interface FirstStepProps {
  setStep: Dispatch<SetStateAction<number>>
  loading: boolean
}

const FirstStep: React.FC<FirstStepProps> = ({ setStep, loading }) => {
  const { showSnackbar } = useSnackbar()

  const formik = useFormik({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
    validate,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true)
      //TODO change to proper reset
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
          "Check your e-mail to finish resetting password"
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
          showSnackbar("error", errors.join(", "))
        }
        showSnackbar("error", error.response.data.error)
      }
      setSubmitting(false)
    },
  })

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <SkeletonLoader loading={loading}>
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
              fontSize: "16px",
              fontWeight: 400,
              color: "#8C8C8C",
            }}
          >
            Please, enter your email, and we will send you a link to reset your
            password.
          </Typography>
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
            Send Email
          </CustomButton>
        </Box>
      </SkeletonLoader>
    </Box>
  )
}

export default FirstStep
