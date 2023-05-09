import React, { useState } from "react";
import { useParams } from "react-router";
import { useStoreState } from "../../store";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Button, Container } from "@mui/material";
import { Appearance } from "./Appearance";
import { UserDefaults } from "./UserDefaults";
import { Services } from "./Services";
import { Backend } from "./Backend";

const steps = ["Appearance", "User defaults", "Services", "Backend"];
const stepsCount = steps.length - 1;
interface IStepper {
  activeStep: number;
}

export default function HorizontalStepper({ activeStep }: IStepper) {
  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
export const AppEdit = () => {
  const { appId } = useParams<{ appId: string }>();
  const [activeStep, setActiveStep] = useState(0);
  const app = useStoreState((s) => s.apps.find((app) => app._id === appId));

  const nextStep = () => {
    setActiveStep((s) => (s += 1));
  };
  const previousStep = () => {
    setActiveStep((s) => (s -= 1));
  };

  const getPage = () => {
    switch (activeStep) {
      case 0:
        return <Appearance />;
      case 1:
        return <UserDefaults />;
      case 2:
        return <Services />;
      case 3:
        return <Backend />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth={"xl"} sx={{ marginTop: 2, minHeight: '70vh'}}>
      <HorizontalStepper activeStep={activeStep} />
      <Box sx={{mt: 2}}>
      {getPage()}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          width: "100%",
          justifyContent: "flex-end",
          mt: 2
        }}
      >
        <Button
          disabled={activeStep === 0}
          variant="contained"
          color={"warning"}
          onClick={previousStep}
        >
          Previous
        </Button>
        <Button
          disabled={activeStep === stepsCount}
          variant="contained"
          onClick={nextStep}
        >
          Next
        </Button>
      </Box>
    </Container>
  );
};
