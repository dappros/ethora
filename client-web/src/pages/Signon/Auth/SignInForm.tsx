import React, { useState } from "react"
import { Box, Typography, Skeleton } from "@mui/material"

import BackButton from "./BackButton"
import LoginStep from "./Steps/LoginStep"

interface SignUpFormProps {
  loading: boolean
  isMobile?: boolean
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  loading = false,
  isMobile = false,
}) => {
  const [activeStep, setActiveStep] = useState(1)

  return (
    <Box
      sx={{
        padding: "16px",
        borderRadius: "24px",
        backgroundColor: "white",
        boxShadow: "0px 4px 35px 0px #00000014",
        py: "40px",
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
            color: "#0052CD",
          }}
        >
          Sign In
        </Typography>
      </Box>
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
        <LoginStep />
      )}
      <Typography align="center" component="span">
        Don't have an account?{" "}
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
          Sign Up
        </Typography>
      </Typography>
    </Box>
  )
}

export default SignUpForm
