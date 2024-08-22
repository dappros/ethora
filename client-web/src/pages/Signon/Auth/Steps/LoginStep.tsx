import { Box, Typography } from "@mui/material"
import React from "react"
import CustomInput from "../Input"
import CustomButton from "../Button"
import {
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Apple as AppleIcon,
} from "@mui/icons-material"

interface FirstStepProps {}

const LoginStep: React.FC<FirstStepProps> = ({}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        <CustomInput fullWidth placeholder={"Email"} type="email" />
        <CustomInput fullWidth placeholder={"Email"} type="password" />
        <CustomButton fullWidth variant="contained" color="primary">
          Sign In
        </CustomButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
        }}
      >
        <Typography sx={{ width: "100%", textAlign: "center" }}>or</Typography>
        <CustomButton fullWidth variant="outlined" startIcon={<GoogleIcon />}>
          Continue with Google
        </CustomButton>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <CustomButton variant="outlined" aria-label="facebook">
          <FacebookIcon />
        </CustomButton>
        <CustomButton variant="outlined" aria-label="apple">
          <AppleIcon />
        </CustomButton>
        <CustomButton variant="outlined" aria-label="custom">
          {/* Replace this with your custom icon */}
          <Box
            component="span"
            sx={{
              display: "inline-block",
              width: 24,
              height: 24,
              backgroundColor: "orange",
              borderRadius: "50%",
            }}
          />
        </CustomButton>
      </Box>
    </Box>
  )
}

export default LoginStep
