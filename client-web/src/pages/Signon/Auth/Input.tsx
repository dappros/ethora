import React from "react"
import { TextField, TextFieldProps } from "@mui/material"
import { styled } from "@mui/material/styles"

interface CustomInputProps extends Omit<TextFieldProps, "variant"> {}

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    borderRadius: 16,
    fontSize: 16,
    border: "none",
    backgroundColor: "#F5F7F9",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
    padding: "8px 16px",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #0052CD",
  },
  "& .MuiInputBase-input": {
    padding: "8px 16px",
    minHeight: "32px",
  },
  "& .MuiFormHelperText-root": {
    position: "absolute",
    bottom: -20,
    right: 0,
    fontSize: 12,
    color: "#8C8C8C",
    margin: 0,
  },
  "& .MuiFormHelperText-root.Mui-error": {
    color: theme.palette.error.main,
  },
  position: "relative",
}))

const CustomInput: React.FC<CustomInputProps> = ({ placeholder, ...props }) => {
  return (
    <StyledTextField
      variant="outlined"
      placeholder={placeholder}
      inputProps={{ style: { minWidth: "40px" } }}
      {...props}
    />
  )
}

export default CustomInput
