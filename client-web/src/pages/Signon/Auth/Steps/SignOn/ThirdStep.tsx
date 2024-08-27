import { Box, Checkbox, Typography } from "@mui/material"
import React from "react"
import CustomInput from "../../Input"
import CustomButton from "../../Button"
import {
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Apple as AppleIcon,
} from "@mui/icons-material"
import SkeletonLoader from "../../../SkeletonLoader"

interface ThirdStepProps {
  loading: boolean
}

const ThirdStep: React.FC<ThirdStepProps> = ({ loading }) => {
  return (
    <SkeletonLoader loading={loading}>
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
          <Typography
            sx={{
              textAlign: "left",
              fontSize: "24px",
              fontWeight: 400,
              color: "#141414",
            }}
          >
            Set your own password
          </Typography>
          <Box
            sx={{
              display: "flex",
              minWidth: "328px",
              gap: 3,
              flex: 1,
              flexDirection: "column",
            }}
          >
            <CustomInput
              placeholder={"Enter temporary password"}
              sx={{ flex: 1, width: "100%" }}
              helperText={
                "You can find temporary password in the verification email."
              }
            />
            <CustomInput
              placeholder={"Enter Your Password"}
              sx={{ flex: 1, width: "100%" }}
            />
            <CustomInput
              placeholder={"Repeat Your Password"}
              sx={{ flex: 1, width: "100%" }}
            />
          </Box>
          <CustomButton fullWidth variant="contained" color="primary">
            Sign Up
          </CustomButton>
        </Box>
      </Box>
    </SkeletonLoader>
  )
}

export default ThirdStep
