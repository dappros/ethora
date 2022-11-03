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
                onSubmit={() => {}}
              >
                <TextField
                  margin="dense"
                  label="First Name"
                  name="appName"
                  variant="standard"
                />
                <TextField
                  margin="dense"
                  label="Last Name"
                  name="appName"
                  variant="standard"
                />
                <TextField
                  margin="dense"
                  label="Description"
                  name="appName"
                  variant="standard"
                />
              </form>
            </Box>
          </Box>
          <Box>
            <Button>Save</Button>
          </Box>
        </Box>
      </Box>
      {change && <ChageImage open={change} setOpen={setChange} />}
    </Dialog>
  );
}
