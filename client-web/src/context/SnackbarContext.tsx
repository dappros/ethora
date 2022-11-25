import React, { createContext, useState, useEffect, useContext } from "react";

// create context
const snackbarState: { open: boolean; action: TAction; message: string } = {
  open: false,
  action: "success",
  message: "",
};

type TAction = "success" | "error" | "warning" | "info";

interface IContext {
  closeSnackbar?: (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => void;
  showSnackbar?: (action: TAction, message: string) => void;
  snackbar: { open: boolean; action: TAction; message: string };
}
const SnackbarContext = createContext<IContext>({ snackbar: snackbarState });

export const SnackbarContextProvider = ({ children }) => {
  // the value that will be given to the context
  const [snackbar, setSnackbar] = useState(snackbarState);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbar({ open: false, action: "success", message: "" });
  };
  const showSnackbar = (action: TAction, message: string) => {
    setSnackbar({ open: true, action, message });
  };
  return (
    <SnackbarContext.Provider
      value={{ snackbar, showSnackbar, closeSnackbar: handleClose }}
    >
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const { snackbar, showSnackbar, closeSnackbar } = useContext(SnackbarContext);
  return { snackbar, showSnackbar, closeSnackbar };
};
