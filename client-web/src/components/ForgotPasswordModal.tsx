import React from "react";
import { LoadingButton } from "@mui/lab";
import { Box, Dialog, DialogTitle, TextField } from "@mui/material";
import { useFormik } from "formik";
import { config } from "../config";
import { useSnackbar } from "../context/SnackbarContext";
import { httpWithToken } from "../http";
import { useStoreState } from "../store";

export interface IForgotPasswordModal {
  open: boolean;
  onClose: () => void;
}

const validate = (values: Record<string, string>) => {
  const errors: Record<string, string> = {};

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  return errors;
};

export const ForgotPasswordModal: React.FC<IForgotPasswordModal> = ({
  open,
  onClose,
}) => {
  const { showSnackbar } = useSnackbar();
  const appToken = useStoreState(s => s.config.appToken)
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate,
    onSubmit: async ({ email }, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      try {
        const res = await httpWithToken(appToken).post<{ msg: string }>(
          "/users/forgot",
          {
            email,
          }
        );
        showSnackbar(
          "success",
          "The password reset email has been successfully sent. Please, check your email for further actions."
        );
        resetForm();
        onClose();
      } catch (error) {
        showSnackbar("error", "Cannot reset email");
      }
      setSubmitting(false);
    },
  });
  return (
    <Dialog maxWidth={false} open={open} onClose={onClose}>
      <Box sx={{ padding: 2 }}>
        <DialogTitle style={{ padding: 0, margin: 0 }}>
          Forgot Password?
        </DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            minWidth: 300,
            maxWidth: "50vw",
          }}
        >
          <form
            onSubmit={formik.handleSubmit}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              flexDirection: "column",
            }}
          >
            <TextField
              margin="normal"
              label="Email"
              name="email"
              type="email"
              fullWidth
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={!!formik.touched.email && !!formik.errors.email}
            />
            <LoadingButton
              loading={formik.isSubmitting}
              variant="contained"
              type={"submit"}
              sx={{ marginTop: 2 }}
            >
              Send link to email
            </LoadingButton>
          </form>
        </Box>
      </Box>
    </Dialog>
  );
};
