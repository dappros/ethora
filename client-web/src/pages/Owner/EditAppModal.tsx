import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import { useStoreState } from "../../store";
import LoadingButton from '@mui/lab/LoadingButton';
import * as http from '../../http'
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  app: {
    _id: string,
    appName: string,
    appDescription: string,
    appGoogleId: string,
    defaultAccessProfileOpen: boolean,
    defaultAccessAssetsOpen: boolean,
    usersCanFree: boolean,
  }
};

export default function EditAppModal({ open, setOpen, app }: TProps) {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false)
  const updateApp = useStoreState(state => state.updateApp)

  const formik = useFormik({
    initialValues: {
      appName: app.appName,
      appDescription: app.appDescription ? app.appDescription : '',
      appGoogleId: app.appGoogleId ? app.appGoogleId : '',
      defaultAccessProfileOpen: app.defaultAccessProfileOpen,
      defaultAccessAssetsOpen: app.defaultAccessAssetsOpen,
      usersCanFree: app.usersCanFree
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
      fd.append("appDesctription", appDescription);
      fd.append("appGoogleId", appGoogleId);
      fd.append("defaultAccessAssetsOpen", defaultAccessAssetsOpen.toString());
      fd.append("defaultAccessProfileOpen", defaultAccessProfileOpen.toString());
      fd.append("usersCanFree", usersCanFree.toString());

      http.updateApp(app._id, fd)
        .then(response => {
          updateApp(response.data.app)
          setOpen(false)
        })
        .finally(() => setLoading(false))
    }
  });

  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <Box>
        <DialogTitle
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          Edit App
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
            >
              Update App
            </LoadingButton>
          </Box>
        </form>
        </Box>
      </Box>
    </Dialog>
  );
}
