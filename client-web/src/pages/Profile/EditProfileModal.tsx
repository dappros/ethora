import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import { useStoreState } from "../../store";
import LoadingButton from "@mui/lab/LoadingButton";
import * as http from "../../http";
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

  const formik = useFormik({
    initialValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      description: user.description,
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
    onSubmit: (values) => {},
  });

  return (
    <Dialog onClose={() => {}} open={open}>
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
            {" "}
            <Box
              sx={{ marginRight: "10px" }}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <img
                style={{ width: "150px", borderRadius: "10px" }}
                alt=""
                src={user.profileImage ? user.profileImage : defUserImage}
              />
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  setChange(true);
                }}
              >
                change image
              </a>
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
                <FormControlLabel
                  checked={formik.values.isProfileOpen}
                  name="isProfileOpen"
                  control={
                    <Checkbox
                      onChange={(e) => {
                        formik.setFieldValue("isProfileOpen", e.target.checked);
                      }}
                    />
                  }
                  label="Is Profile Open"
                  labelPlacement="end"
                />
                <FormControlLabel
                  checked={formik.values.isAssetsOpen}
                  name="isAssetsOpen"
                  control={
                    <Checkbox
                      onChange={(e) => {
                        formik.setFieldValue(
                          "defaultAccessProfileOpen",
                          e.target.checked
                        );
                      }}
                    />
                  }
                  label="Is Assets Open"
                  labelPlacement="end"
                />
              </form>
            </Box>
          </Box>
          <Box>
            <Button variant="contained">Save</Button>
          </Box>
        </Box>
      </Box>
      {change && <ChageImage open={change} setOpen={setChange} />}
    </Dialog>
  );
}
