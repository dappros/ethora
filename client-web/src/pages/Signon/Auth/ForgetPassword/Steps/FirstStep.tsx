import React, { Dispatch, SetStateAction } from "react"
import { Box, Typography } from "@mui/material"
import { useFormik } from "formik"
import CustomButton from "../../Button"
import CustomInput from "../../Input"
import { postForgotPassword } from "../../../../../http"
import { useSnackbar } from "../../../../../context/SnackbarContext"
import { useHistory } from "react-router"
import { useStoreState } from "../../../../../store"

const validate = (values: { email: string }) => {
  const errors: Record<string, string> = {}

  if (!values.email) {
    errors.email = "Required field"
  } else if (!/^[\w%+.-]+@[\d.a-z-]+\.[a-z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address"
  }

  return errors
}

interface FirstStepProps {
  setStep: Dispatch<SetStateAction<number>>
}

const FirstStep: React.FC<FirstStepProps> = ({ setStep }) => {
  const { showSnackbar } = useSnackbar()
  const history = useHistory()
  const config = useStoreState((state) => state.config)

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true)
      //TODO change to proper reset
      try {
        const resp = await postForgotPassword(values.email)
        console.log(resp)
        resetForm()
        showSnackbar(
          "success",
          "Check your e-mail to finish resetting password"
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

  const setEmailQuery = (email: string) => {
    const params = new URLSearchParams(location.search)
    params.set("email", email)
    history.push({ search: params.toString() })
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
          disabled={formik.isSubmitting}
          style={{
            backgroundColor: config?.primaryColor
              ? config.primaryColor
              : "#0052CD",
          }}
        >
          Send Email
        </CustomButton>
      </Box>
    </Box>
  )
}

export default FirstStep
