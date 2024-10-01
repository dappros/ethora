import React, { useEffect, useState } from "react"
import { Box, Typography } from "@mui/material"

import { useHistory } from "react-router-dom"
import BackButton from "../BackButton"
import FirstStep from "../ForgetPassword/Steps/FirstStep"
import SecondStep from "../ForgetPassword/Steps/SecondStep"
import ThirdStep from "../ForgetPassword/Steps/ThirdStep"
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace"
import CustomStepper from "../Stepper"
import { useStoreState } from "../../../../store"

interface ForgetPasswordFormProps {
  isMobile: boolean
}

const ForgetPasswordForm: React.FC<ForgetPasswordFormProps> = ({
  isMobile,
}) => {
  const [activeStep, setActiveStep] = useState(0)
  const config = useStoreState((state) => state.config)

  const history = useHistory()

  useEffect(() => {
    if (history.location.pathname.split("/")?.[2]?.length > 0) {
      setActiveStep(2)
    }
  }, [history.location.pathname])

  const steps = [
    <FirstStep setStep={setActiveStep} />,
    <SecondStep />,
    <ThirdStep />,
  ]

  const StepComponent = ({ step }) => {
    return steps[step] || <div>Step not found</div>
  }

  const setQuery = (query: string) => {
    history.push(query)
  }

  const handleBackButtonClick = () => {
    setActiveStep((prev) => prev - 1)
    history.replace("/resetPassword")
  }

  return (
    <Box
      sx={{
        justifyContent: "space-between",
        padding: "16px",
        borderRadius: "24px",
        backgroundColor: "white",
        boxShadow: isMobile ? "none" : "0px 4px 35px 0px #00000014",
        p: isMobile ? "0px 16px" : "24px 40px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        minWidth: "300px",
        width: "100%",
        maxHeight: isMobile ? "732px" : "588px",
        minHeight: isMobile ? "inherit" : "588px",
        height: "100%",
        maxWidth: isMobile ? "486px" : "600px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
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
          {activeStep > 0 && <BackButton onPress={handleBackButtonClick} />}
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
        <CustomStepper
          step={activeStep}
          color={config?.primaryColor ? config.primaryColor : "#0052CD"}
        />
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
          <KeyboardBackspaceIcon
            sx={{
              color: config?.primaryColor ? config.primaryColor : "#0052CD",
            }}
          />
          <Typography
            style={{
              color: config?.primaryColor ? config.primaryColor : "#0052CD",
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
              color: config?.primaryColor ? config.primaryColor : "#0052CD",
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
