import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import { useStoreState } from "../../store";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import LoadingButton from "@mui/lab/LoadingButton";
import * as http from "../../http";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import { NativeSelect } from "@mui/material";
import { useSnackbar } from "../../context/SnackbarContext";

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUsers: React.Dispatch<React.SetStateAction<any>>;
  appId: string;
};

export default function NewUserModal({
  open,
  setOpen,
  setUsers,
  appId,
}: TProps) {
  const apps = useStoreState((state) => state.apps);
  const addAppUsers = useStoreState((state) => state.addAppUsers);
  // const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.firstName) {
        errors.firstName = "Required";
      }

      if (!values.lastName) {
        errors.lastName = "Required";
      }

      if (!values.email) {
        errors.email = "Required";
      }

      return errors;
    },
    onSubmit: async (
      { email, firstName, lastName },
      { resetForm, setSubmitting }
    ) => {
      setSubmitting(true);
      const app = apps.find((el) => el._id === appId);
      try {
        const result = await http.registerNewUser(
          appId,
          email,
          firstName,
          lastName,
          app?.appToken
        );
        setUsers((old) => {
          return [...old, result.data.user];
        });
        resetForm();

        setOpen(false);
      } catch (error) {
        showSnackbar(
          "error",
          "Cannot create user " + (error.response?.data?.errors?.[0]?.msg ??  "")
        );
      }

      setSubmitting(false);
    },
  });

  if (apps.length === 0) {
    return (
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">There is no apps</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You should create app first please!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={formik.isSubmitting}
            variant="contained"
            autoFocus
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <Box style={{ width: "400px" }}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: 1,
            m: 0,
          }}
        >
          New User
          <IconButton
            disabled={formik.isSubmitting}
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box sx={{ width: "100%", typography: "body1", padding: 1, pt: 0 }}>
          <form onSubmit={formik.handleSubmit}>
            <Box>
              <TextField
                fullWidth
                error={
                  formik.touched.firstName && formik.errors.firstName
                    ? true
                    : false
                }
                helperText={
                  formik.touched.firstName && formik.errors.firstName
                    ? formik.errors.firstName
                    : ""
                }
                margin="dense"
                label="First Name"
                name="firstName"
                variant="standard"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
              />
              <TextField
                fullWidth
                error={
                  formik.touched.lastName && formik.errors.lastName
                    ? true
                    : false
                }
                helperText={
                  formik.touched.lastName && formik.errors.lastName
                    ? formik.errors.lastName
                    : ""
                }
                margin="dense"
                label="Last Name"
                name="lastName"
                variant="standard"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
              />
              <TextField
                fullWidth
                error={
                  formik.touched.lastName && formik.errors.email ? true : false
                }
                helperText={
                  formik.touched.email && formik.errors.email
                    ? formik.errors.email
                    : ""
                }
                margin="dense"
                label="Email"
                name="email"
                variant="standard"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <LoadingButton
                loading={formik.isSubmitting}
                variant="contained"
                style={{ marginTop: "15px" }}
                type="submit"
                disabled={formik.isSubmitting}
              >
                Create New User
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </Box>
    </Dialog>
  );
}
