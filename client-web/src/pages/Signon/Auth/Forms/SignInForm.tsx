import React, { useState } from "react"
import { Box, Typography, Skeleton } from "@mui/material"

import LoginStep from "../Steps/SignIn/LoginForm"
import { useLocation, useHistory } from "react-router-dom"

interface SignInFormProps {
  loading: boolean
  isMobile?: boolean
  config: string[]
}

const SignInForm: React.FC<SignInFormProps> = ({
  loading = false,
  isMobile = false,
}) => {
  const history = useHistory()

  const setSignUpQuery = () => {
    history.push("register")
  }

  const handleSignIn = () => {
    setSignUpQuery()
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
        maxWidth: isMobile ? "486px" : "100%",
        maxHeight: isMobile ? "540px" : "1000px",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
        }}
      >
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
          Sign In
        </Typography>
      </Box>
      <LoginStep />
      <Typography align="center" component="span">
        Don't have an account?{" "}
        <Typography
          style={{
            textDecoration: "underline",
            color: "#0052CD",
            fontSize: "14px",
            display: "inline",
            cursor: "pointer",
            fontWeight: "400px",
          }}
          onClick={handleSignIn}
        >
          Sign Up
        </Typography>
      </Typography>
    </Box>
  )
}

export default SignInForm
