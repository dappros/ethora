import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import { useHistory } from "react-router-dom";
import { useStoreState } from "../../store";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import * as http from '../../http'
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewAppModal({ open, setOpen }: TProps) {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const setApp = useStoreState((state) => state.setApp);
  const history = useHistory();
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const formik = useFormik({
    initialValues: {
      appName: "",
      appDescription: "",
      appGoogleId: "",
      defaultAccessProfileOpen: false,
      defaultAccessAssetsOpen: false,
      usersCanFree: false,
      newUserTokenGift: 0,
      coinsDayliBonus: 0,
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.appName) {
        errors.appName = "Required";
      }

      return errors;
    },
    onSubmit: ({
      appName,
      appDescription,
      appGoogleId,
      defaultAccessAssetsOpen,
      defaultAccessProfileOpen,
      usersCanFree
    }) => {
      setLoading(true);
      const fd = new FormData();
      let file;
      if (fileRef.current) {
        const files = fileRef.current.files;
        if (files) {
          file = files[0];
        }
      }

      if (file) {
        fd.append("file", file);
      }

      fd.append("appName", appName);
      fd.append("appDescription", appDescription);
      fd.append("appGoogleId", appGoogleId);
      fd.append("defaultAccessAssetsOpen", defaultAccessAssetsOpen.toString());
      fd.append("defaultAccessProfileOpen", defaultAccessProfileOpen.toString());
      fd.append("usersCanFree", usersCanFree.toString());

      http.createApp(fd)
        .then(response => {
          console.log(response.data)
          setApp(response.data.app)
          setOpen(false)
        })
        .finally(() => setLoading(false))
    }
  });

  return (
    <Dialog onClose={() => {}} open={open}>
      <Box>
        <DialogTitle
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          New App
          <IconButton disabled={loading} onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box sx={{ width: "100%", typography: "body1", padding: 1 }}>
        <form onSubmit={formik.handleSubmit}>
          <Box>
            <TextField
              error={
                formik.touched.appName && formik.errors.appName ? true : false
              }
              helperText={
                formik.touched.appName && formik.errors.appName
                  ? formik.errors.appName
                  : ""
              }
              margin="dense"
              label="App Name"
              name="appName"
              variant="standard"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.appName}
            />
          </Box>
          <Box>
            <TextField
              margin="dense"
              label="Google Client Id"
              name="appGoogleId"
              variant="standard"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.appGoogleId}
            />
          </Box>
          <Box style={{ display: "inline-flex", flexDirection: "column" }}>
            <FormControlLabel
              checked={formik.values.defaultAccessProfileOpen}
              name="defaultAccessProfileOpen"
              control={
                <Checkbox
                  onChange={(e) =>
                    formik.setFieldValue(
                      "defaultAccessProfileOpen",
                      e.target.checked
                    )
                  }
                />
              }
              label="defaultAccessProfileOpen"
              labelPlacement="end"
              onChange={formik.handleChange}
            />
            <FormControlLabel
              checked={formik.values.defaultAccessAssetsOpen}
              name="defaultAccessAssetsOpen"
              control={
                <Checkbox
                  onChange={(e) =>
                    formik.setFieldValue(
                      "defaultAccessAssetsOpen",
                      e.target.checked
                    )
                  }
                />
              }
              label="defaultAccessAssetsOpen"
              labelPlacement="end"
            />
            <FormControlLabel
              checked={formik.values.usersCanFree}
              name="usersCanFree"
              control={
                <Checkbox
                  onChange={(e) =>
                    formik.setFieldValue("usersCanFree", e.target.checked)
                  }
                />
              }
              label="usersCanFree"
              labelPlacement="end"
            />

            <input ref={fileRef} type="file" accept="image/*"></input>
            <LoadingButton
              loading={loading}
              variant="contained"
              style={{ marginTop: "15px" }}
              type="submit"
              disabled={loading}
            >
              Create App
            </LoadingButton>
          </Box>
        </form>
        </Box>
      </Box>
    </Dialog>
  );
}
