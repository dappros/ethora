import { Box, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import CustomButton from "../../Button"
import SkeletonLoader from "../../../SkeletonLoader"
import { resendLink } from "../../../../../http"
import { useSnackbar } from "../../../../../context/SnackbarContext"
import { useHistory } from "react-router"

interface SecondStepProps {
  loading: boolean
}

const SecondStep: React.FC<SecondStepProps> = ({ loading }) => {
  const queryParams = new URLSearchParams(location.search)
  const email = queryParams.get("email")
  const { showSnackbar } = useSnackbar()
  const history = useHistory()

  useEffect(() => {
    if (!email || email === "") {
      history.replace("/register")
    }
  }, [])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleResend = () => {
    setIsSubmitting(true)
    resendLink(email)
      .then(() => {
        showSnackbar("success", "Email has been resent")
        setIsSubmitting(false)
      })
      .catch((err) => {
        setIsSubmitting(false)
        showSnackbar("error", "An error occured")
      })
  }

  return (
    <SkeletonLoader loading={loading}>
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
          Confirm your email address
        </Typography>
        <Typography
          sx={{
            textAlign: "left",
            fontSize: "16px",
            fontWeight: 400,
            color: "#8C8C8C",
          }}
        >
          We`ve sent an email to {email ? email : "your email"}
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
            Still can`t find the email?
          </Typography>
          <CustomButton
            fullWidth
            aria-label="custom"
            onClick={handleResend}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Resend Email
          </CustomButton>
        </Box>
      </Box>
    </SkeletonLoader>
  )
}

export default SecondStep
