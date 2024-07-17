import { Step } from "@mui/material"
import React from "react"

interface StepperProps {}

const Stepper: React.FC<StepperProps> = ({}) => {
  return (
    <div>
      <Step>1</Step>
      <Step>2</Step>
      <Step>3</Step>
    </div>
  )
}

export default Stepper
