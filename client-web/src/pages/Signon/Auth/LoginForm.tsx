import React, { useState } from "react";
import { Box, Typography, Skeleton } from "@mui/material";

import CustomStepper from "./Steps/Stepper";
import FirstStep from "./Steps/FirstStep";
import SecondStep from "./Steps/SecondStep";
import ThirdStep from "./Steps/ThirdStep";

interface LoginFormProps {
  loading: boolean;
}

const steps = {
  0: <FirstStep />,
  1: <SecondStep />,
  2: <ThirdStep />,
};

const StepComponent = ({ step }) => {
  return steps[step] || <div>Step not found</div>;
};

const LoginForm: React.FC<LoginFormProps> = ({ loading = false }) => {
  const [activeStep, setActiveStep] = useState(0);

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
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontFamily: "Varela Round",
          fontWeight: 400,
          fontSize: "34px",
        }}
      >
        Sign Up
      </Typography>
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
  );
};

export default LoginForm;
