import React, { useState } from "react"
import { Box, Typography } from "@mui/material"

import { useHistory } from "react-router-dom"
import BackButton from "../BackButton"
import CustomStepper from "../Steps/Stepper"
import FirstStep from "../Steps/ForgetPassword/FirstStep"
import SecondStep from "../Steps/ForgetPassword/SecondStep"
import ThirdStep from "../Steps/ForgetPassword/ThirdStep"
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace"

interface ForgetPasswordFormProps {
  loading: boolean
  isMobile: boolean
}

const ForgetPasswordForm: React.FC<ForgetPasswordFormProps> = ({
  loading = false,
  isMobile,
}) => {
  const [activeStep, setActiveStep] = useState(0)

  const history = useHistory()

  const steps = [
    <FirstStep setStep={setActiveStep} loading={loading} />,
    <SecondStep loading={loading} />,
    <ThirdStep loading={loading} />,
  ]

  const StepComponent = ({ step }) => {
    return steps[step] || <div>Step not found</div>
  }

  const setQuery = (query: string) => {
    const params = new URLSearchParams(location.search)
    params.set("action", query)
    history.push({ search: params.toString() })
  }

  return (
    <Box
      sx={{
        padding: "16px",
        borderRadius: "24px",
        backgroundColor: "white",
        boxShadow: isMobile ? "none" : "0px 4px 35px 0px #00000014",
        p: isMobile ? "0px" : "24px 40px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        minWidth: "455px",
        width: "100%",
        maxWidth: isMobile ? "486px" : "568px",
        maxHeight: isMobile ? "540px" : "1000px",
        minHeight: isMobile ? "0px" : "588px",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          gap: "16px",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
          }}
        >
          {activeStep > 0 && (
            <BackButton onPress={() => setActiveStep((prev) => prev - 1)} />
          )}
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontFamily: "Varela Round",
              fontWeight: 400,
              fontSize: "24px",
              height: "32px",
              color: "#141414",
              m: 0,
            }}
          >
            Forgot Password
          </Typography>
        </Box>
        <CustomStepper step={activeStep} />
        <StepComponent step={activeStep} />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
          onClick={() => setQuery("signIn")}
        >
          <KeyboardBackspaceIcon sx={{ color: "#0052CD" }} />
          <Typography
            style={{
              color: "#0052CD",
              display: "inline",
              fontSize: "16px",
              lineHeight: "24px",
            }}
          >
            Back to Sign In
          </Typography>
        </Box>
        <Typography
          align="center"
          component="span"
          sx={{
            fontSize: "14px",
          }}
        >
          Don't have an account?{" "}
          <Typography
            style={{
              textDecoration: "underline",
              color: "#0052CD",
              display: "inline",
              fontSize: "14px",
              cursor: "pointer",
            }}
            onClick={() => setQuery("signUp")}
          >
            Sign Up
          </Typography>
        </Typography>
      </Box>
    </Box>
  )
}

export default ForgetPasswordForm
