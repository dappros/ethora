import React, { useState } from "react"
import { Box, Typography, Skeleton } from "@mui/material"

import CustomStepper from "./Steps/Stepper"
import FirstStep from "./Steps/FirstStep"
import SecondStep from "./Steps/SecondStep"
import ThirdStep from "./Steps/ThirdStep"
import BackButton from "./BackButton"

interface SignUpFormProps {
  loading: boolean
  isMobile?: boolean
  signUpWithGoogle: () => void
  signUpWithApple: () => void
  signUpWithFacebook: () => void
  signUpWithMetamask: () => void
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  loading = false,
  isMobile = false,
  signUpWithGoogle,
  signUpWithApple,
  signUpWithFacebook,
  signUpWithMetamask,
}) => {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    <FirstStep
      signUpWithGoogle={signUpWithGoogle}
      signUpWithApple={signUpWithApple}
      signUpWithFacebook={signUpWithFacebook}
      signUpWithMetamask={signUpWithMetamask}
      setStep={setActiveStep}
    />,
    <SecondStep />,
    <ThirdStep />,
  ]

  const StepComponent = ({ step }) => {
    return steps[step] || <div>Step not found</div>
  }

  return (
    <Box
      sx={{
        padding: "16px",
        borderRadius: "24px",
        backgroundColor: "white",
        boxShadow: "0px 4px 35px 0px #00000014",
        py: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        minWidth: "455px",
        width: "100%",
        minHeight: "598px",
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
            fontSize: "34px",
            color: activeStep === 2 ? "#0052CD" : "#141414",
          }}
        >
          Sign Up
        </Typography>
      </Box>
      <CustomStepper step={activeStep} />
      {loading ? (
        <>
          <Skeleton
            variant="rectangular"
            height={56}
            width={438}
            sx={{ mb: 2 }}
          />
          <Skeleton
            variant="rectangular"
            height={56}
            width={438}
            sx={{ mb: 2 }}
          />
          <Skeleton
            variant="rectangular"
            height={56}
            width={438}
            sx={{ mb: 2 }}
          />
          <Skeleton
            variant="rectangular"
            height={56}
            width={438}
            sx={{ mb: 2 }}
          />
          <Skeleton variant="text" height={40} width={438} sx={{ mb: 2 }} />
          <Skeleton
            variant="rectangular"
            height={56}
            width={438}
            sx={{ mb: 2 }}
          />
          <Skeleton
            variant="rectangular"
            height={56}
            width={438}
            sx={{ mb: 2 }}
          />
        </>
      ) : (
        <StepComponent step={activeStep} />
      )}
      <Typography align="center" component="span">
        Already have an account?{" "}
        <Typography
          component="a"
          href="/terms"
          style={{
            textDecoration: "underline",
            color: "blue",
            fontSize: "14px",
            display: "inline",
          }}
        >
          Sign In
        </Typography>
      </Typography>
    </Box>
  )
}

export default SignUpForm
