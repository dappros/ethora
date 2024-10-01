import { Box, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import CustomButton from "../../Button"
import SkeletonLoader from "../../../SkeletonLoader"
import { useHistory } from "react-router"
import { postForgotPassword } from "../../../../../http"
import { useSnackbar } from "../../../../../context/SnackbarContext"
import { useStoreState } from "../../../../../store"

interface SecondStepProps {}

const SecondStep: React.FC<SecondStepProps> = ({}) => {
  const queryParams = new URLSearchParams(location.search)
  const email = queryParams.get("email")
  const { showSnackbar } = useSnackbar()
  const config = useStoreState((state) => state.config)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const history = useHistory()

  useEffect(() => {
    if (!email || email === "") {
      history.replace("/resetPassword")
    }
  }, [])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await postForgotPassword(email)
      .then(() => {
        showSnackbar("success", "Check your e-mail to reach reset link")
      })
      .catch(() => {
        showSnackbar("error", "There is an error with resending email")
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <Typography
        sx={{
          textAlign: "left",
          fontSize: "24px",
          fontWeight: 400,
          color: "#141414",
        }}
      >
        Check your email address
      </Typography>
      <Typography
        sx={{
          textAlign: "left",
          fontSize: "16px",
          fontWeight: 400,
          color: "#8C8C8C",
        }}
      >
        We’ve sent an email to {email ? email : "your email"}
      </Typography>
      <Box component="ul" sx={{ paddingLeft: "20px", margin: 0 }}>
        <Typography
          component="li"
          sx={{
            textAlign: "left",
            fontSize: "16px",
            fontWeight: 400,
            color: "#141414",
            marginBottom: "8px",
          }}
        >
          Just click on the link in the email to continue the registration
          process.
        </Typography>
        <Typography
          component="li"
          sx={{
            textAlign: "left",
            fontSize: "16px",
            fontWeight: 400,
            color: "#141414",
          }}
        >
          If you don’t see it, check your spam folder.
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "14px",
            fontWeight: 400,
            color: "#8C8C8C",
            width: "100%",
          }}
        >
          Still can’t find the email?
        </Typography>
        <CustomButton
          fullWidth
          aria-label="custom"
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={{
            backgroundColor: config?.primaryColor
              ? config.primaryColor
              : "#0052CD",
          }}
        >
          Resend Email
        </CustomButton>
      </Box>
    </Box>
  )
}

export default SecondStep
