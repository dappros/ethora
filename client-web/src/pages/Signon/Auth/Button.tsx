import { Button, ButtonProps, CircularProgress } from "@mui/material"
import React, { ReactNode } from "react"

interface CustomButtonProps extends ButtonProps {
  children: ReactNode
  loading?: boolean
  placeholder?: string
  variant?: "contained" | "outlined"
}

const CustomButton: React.FC<CustomButtonProps> = ({
  placeholder,
  style,
  children,
  loading,
  variant = "contained",
  ...props
}) => {
  return (
    <Button
      sx={{
        borderRadius: "16px",
        padding: "12px 16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        fontFamily: "Varela Round",
        fontSize: "16px",
        textAlign: "center",
        flex: 1,
        backgroundColor: variant === "contained" ? "#0052CD" : "#FFFFFF",
        color: variant === "contained" ? "#FFFFFF" : "#0052CD",
        border: variant === "outlined" ? "1px solid #0052CD" : "none",
        "&:active": {
          outline: "2px solid #0052CD",
        },
        "&:hover": {
          backgroundColor: variant === "outlined" ? "#FFFFFF" : "#5d8dd6",
        },
        height: '48px'
      }}
      style={style}
      {...props}
    >
      {loading && <CircularProgress size={24} />}
      {children}
    </Button>
  )
}

export default CustomButton
