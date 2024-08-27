import { Box, Checkbox, Typography } from "@mui/material"
import React from "react"
import CustomInput from "../../Input"
import CustomButton from "../../Button"
import { Google as GoogleIcon } from "@mui/icons-material"
import SkeletonLoader from "../../../SkeletonLoader"

interface SecondStepProps {
  loading: boolean
}

const SecondStep: React.FC<SecondStepProps> = ({ loading }) => {
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
          We`ve sent an email to email@gmail.com
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
          <CustomButton fullWidth aria-label="custom">
            Resend Email
          </CustomButton>
        </Box>
      </Box>
    </SkeletonLoader>
  )
}

export default SecondStep
