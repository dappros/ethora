import { Box, Checkbox, Typography } from "@mui/material";
import React from "react";
import CustomInput from "../Input";
import CustomButton from "../Button";
import {
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Apple as AppleIcon,
} from "@mui/icons-material";

interface FirstStepProps {}

const FirstStep: React.FC<FirstStepProps> = ({}) => {
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
        <Box
          sx={{
            display: "flex",
            minWidth: "328px",
            gap: 3,
            flex: 1,
          }}
        >
          <CustomInput
            placeholder={"First Name"}
            sx={{ flex: 1, width: "100%" }}
          />
          <CustomInput
            placeholder={"Last Name"}
            sx={{ flex: 1, width: "100%" }}
          />
        </Box>
        <CustomInput fullWidth placeholder={"Email"} type="email" />
        <CustomButton fullWidth variant="contained" color="primary">
          Sign Up
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <Checkbox />
          <Box
            sx={{
              display: "flex",
              fontSize: "14px",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: "8px",
            }}
          >
            <Typography component="span">I agree with</Typography>
            <Typography
              component="a"
              href="/terms"
              sx={{
                textDecoration: "underline",
                color: "blue",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Terms and Conditions
            </Typography>
          </Box>
        </Box>
        <Typography>or</Typography>
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
  );
};

export default FirstStep;
