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

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUsers: React.Dispatch<React.SetStateAction<any>>;
};

export default function NewUserModal({ open, setOpen, setUsers }: TProps) {
  const apps = useStoreState((state) => state.apps);
  const addAppUsers = useStoreState((state) => state.addAppUsers);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      appId: apps[0]?._id,
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.firstName) {
        errors.firstName = "Required";
      }

      if (!values.lastName) {
        errors.lastName = "Required";
      }

      if (!values.username) {
        errors.username = "Required";
      }

      if (!values.password) {
        errors.password = "Required";
      }

      return errors;
    },
    onSubmit: ({ username, firstName, lastName, password, appId }) => {
      setLoading(true);
      const app = apps.find((el) => el._id === appId);
      http
        .registerUsername(
          username,
          password,
          firstName,
          lastName,
          app?.appToken
        )
        .then((result) => {
          setUsers((old) => {
            return [...old, result.data.user];
          });
          setOpen(false);
        });
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
            disabled={loading}
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
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          New User
          <IconButton disabled={loading} onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box sx={{ width: "100%", typography: "body1", padding: 1 }}>
          <form onSubmit={formik.handleSubmit}>
            <Box>
              <FormControl fullWidth>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  App
                </InputLabel>
                <NativeSelect
                  inputProps={{
                    name: "appName",
                    id: "uncontrolled-native",
                  }}
                  onChange={(e) => {
                    formik.setFieldValue("appId", e.target.value);
                  }}
                >
                  {apps.map((app) => {
                    return (
                      <option key={app._id} value={app._id}>
                        {app.appName}
                      </option>
                    );
                  })}
                </NativeSelect>
              </FormControl>
            </Box>
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
                  formik.touched.lastName && formik.errors.username
                    ? true
                    : false
                }
                helperText={
                  formik.touched.username && formik.errors.username
                    ? formik.errors.username
                    : ""
                }
                margin="dense"
                label="Username"
                name="username"
                variant="standard"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
              />
              <TextField
                fullWidth
                error={
                  formik.touched.password && formik.errors.password
                    ? true
                    : false
                }
                helperText={
                  formik.touched.password && formik.errors.password
                    ? formik.errors.password
                    : ""
                }
                margin="dense"
                label="Password"
                name="password"
                variant="standard"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
            </Box>
            <Box
              style={{
                display: "inline-flex",
                margin: "0 auto",
                flexDirection: "column",
              }}
            >
              <LoadingButton
                loading={loading}
                variant="contained"
                style={{ marginTop: "15px" }}
                type="submit"
                disabled={loading}
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
