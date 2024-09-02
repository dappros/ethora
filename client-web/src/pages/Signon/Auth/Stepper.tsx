import * as React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

interface CustomStepperProps {
  step: number;
}

const steps = ["Step 1", "Step 2", "Step 3"];

const Line = styled("div")<{ active: boolean; completed: boolean }>`
  height: 4px;
  width: 100%;
  border-radius: 2px;
  background-color: ${(props) =>
    props.completed ? "#0052CD" : props.active ? "#004AC2" : "#D4D4D4"};
`;

const CustomStepLine: React.FC<{ active: boolean; completed: boolean }> = ({
  active,
  completed,
}) => <Line active={active} completed={completed} />;

const CustomStepper: React.FC<CustomStepperProps> = ({ step }) => {
  const [activeStep, setActiveStep] = React.useState(step);

  React.useEffect(() => {
    setActiveStep(step);
  }, [step]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        gap: "16px",
      }}
    >
      {steps.map((label, index) => (
        <Box key={`step-${label}`} sx={{ flex: 1 }}>
          <CustomStepLine
            active={index <= activeStep}
            completed={index <= activeStep}
          />
        </Box>
      ))}
    </Box>
  );
};

export default CustomStepper;
