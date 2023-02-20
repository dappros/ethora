import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Tooltip } from "@mui/material";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import { useStoreState } from "../../store";
import LoadingButton from "@mui/lab/LoadingButton";
import { httpWithAuth } from "../../http";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import ChageImage from "./ChangeImage";
import defUserImage from "../../assets/images/def-ava.png";

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
};

export default function EditProfileModal({ open, setOpen, user }: TProps) {
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const setUser = useStoreState((state) => state.setUser);

  const formik = useFormik({
    initialValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      description: user.description ? user.description : "",
      isProfileOpen: user.isProfileOpen,
      isAssetsOpen: user.isAssetsOpen,
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.firstName) {
        errors.firstName = "Required";
      }

      if (!values.lastName) {
        errors.lastName = "Required";
      }

      return errors;
    },
    onSubmit: (values) => {
      const fd = new FormData();
      fd.append("firstName", values.firstName);
      fd.append("lastName", values.lastName);

      if (values.description) {
        fd.append("description", values.description);
      }

      fd.append("isProfileOpen", values.isProfileOpen);
      fd.append("isAssetsOpen", values.isAssetsOpen);
      setLoading(true);
      httpWithAuth()
        .put("/users", fd)
        .then((response) => {
          const respUser = response.data.user;
          setUser({
            ...user,
            firstName: respUser.firstName,
            lastName: respUser.lastName,
            description: respUser.description,
            isProfileOpen: respUser.isProfileOpen,
            isAssetsOpen: respUser.isAssetsOpen,
          });
          setOpen(false);
        })
        .finally(() => setLoading(false));
    },
  });

  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <Box>
        <DialogTitle
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          Edit Profile
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box sx={{ width: "100%", typography: "body1", padding: 1 }}>
          <Box style={{ display: "flex" }}>
            <Box
              sx={{ marginRight: "10px" }}
              style={{
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
              }}
            >
              <div onClick={() => setChange(true)}>
                <img
                  style={{ width: "150px", borderRadius: "10px" }}
                  alt=""
                  src={user.profileImage ? user.profileImage : defUserImage}
                />
              </div>
            </Box>
            <Box>
              <form
                style={{ display: "flex", flexDirection: "column" }}
                onSubmit={formik.handleSubmit}
              >
                <TextField
                  margin="dense"
                  label="First Name"
                  name="firstName"
                  variant="standard"
                  error={
                    formik.touched.firstName && formik.errors.firstName
                      ? true
                      : false
                  }
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                      ? (formik.errors.firstName as string)
                      : ""
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                />
                <TextField
                  margin="dense"
                  label="Last Name"
                  name="lastName"
                  variant="standard"
                  error={
                    formik.touched.lastName && formik.errors.lastName
                      ? true
                      : false
                  }
                  helperText={
                    formik.touched.lastName && formik.errors.lastName
                      ? (formik.errors.lastName as string)
                      : ""
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                />
                <TextField
                  margin="dense"
                  label="Profile Description"
                  name="description"
                  variant="standard"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                />
                <Tooltip
                  placement={"top"}
                  title={
                    "When enabled, your profile and documents will be visible by all visitors. When disabled, your profile will only be seen by those who received a direct sharing link from you."
                  }
                >
                  <FormControlLabel
                    checked={formik.values.isProfileOpen}
                    name="isProfileOpen"
                    control={
                      <Checkbox
                        onChange={(e) => {
                          formik.setFieldValue(
                            "isProfileOpen",
                            e.target.checked
                          );
                        }}
                      />
                    }
                    label="Profile is public"
                    labelPlacement="end"
                  />
                </Tooltip>
                <Tooltip
                  placement={"bottom"}
                  title={
                    "When this is enabled, all of your documents will be visible to those who have access to your profile. When this is disabled, you will need to share your documents individually so others can see them."
                  }
                >
                  <FormControlLabel
                    checked={formik.values.isAssetsOpen || formik.values.isProfileOpen}
                    name="isAssetsOpen"
                    control={
                      <Checkbox
                        disabled={formik.values.isProfileOpen}
                        onChange={(e) => {
                          formik.setFieldValue(
                            "isAssetsOpen",
                            e.target.checked
                          );
                        }}
                      />
                    }
                    label="Documents are public"
                    labelPlacement="end"
                  />
                </Tooltip>
                <LoadingButton
                  type="submit"
                  loading={loading}
                  variant="contained"
                >
                  Save
                </LoadingButton>
              </form>
            </Box>
          </Box>
        </Box>
      </Box>
      {change && <ChageImage open={change} setOpen={setChange} />}
    </Dialog>
  );
}
