import { Button, ButtonProps, CircularProgress } from "@mui/material";
import React, { ReactNode } from "react";

interface CustomButtonProps extends ButtonProps {
  children: ReactNode;
  loading?: boolean;
  placeholder?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  placeholder,
  style,
  children,
  loading,
  ...props
}) => {
  return (
    <>
      <Button
        style={style}
        {...props}
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
          "&:active": {
            borderColor: "#0052CD",
            borderWidth: "2px",
            borderStyle: "solid",
          },
        }}
      >
        {loading && <CircularProgress size={24} />}
        {children}
      </Button>
    </>
  );
};

export default CustomButton;
