import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import { useStoreState } from "../../store";
import LoadingButton from "@mui/lab/LoadingButton";
import * as http from "../../http";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@mui/material";
import { useSnackbar } from "../../context/SnackbarContext";

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewAppModal({ open, setOpen }: TProps) {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const setApp = useStoreState((state) => state.setApp);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const {showSnackbar} = useSnackbar()
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
      usersCanFree,
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
      fd.append(
        "defaultAccessProfileOpen",
        defaultAccessProfileOpen.toString()
      );
      fd.append("usersCanFree", usersCanFree.toString());

      http
        .createApp(fd)
        .then((response) => {
          setApp(response.data.app);
          setOpen(false);
        }).catch(e => {
          console.log(e)
showSnackbar('error', 'Cannot create the app ' +( e.response?.data?.error || ''))
        })
        .finally(() => setLoading(false));
    },
  });

  const onImage = (event: any) => {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e) {
          if (e.target?.result) {
            setPreview(e.target.result as string);
          }
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  };
  const onClose = () => {
    setOpen(false);
    setPreview("");
  };
  return (
    <Dialog onClose={onClose} open={open}>
      <Box sx={{ padding: 1, minWidth: 500 }}>
        <IconButton
          sx={{ position: "absolute", top: 0, right: 0 }}
          disabled={loading}
          onClick={() => setOpen(false)}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle sx={{ padding: 1 }}>New App</DialogTitle>
        <Box sx={{ width: "100%", padding: 1 }}>
          <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
            <Box>
              <TextField
                sx={{ width: "100%" }}
                error={!!formik.touched.appName && !!formik.errors.appName}
                margin="dense"
                label="App Name"
                name="appName"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.appName}
              />
            </Box>
            <Box>
              <TextField
                sx={{ width: "100%" }}
                margin="dense"
                label="Google Client Id"
                name="appGoogleId"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.appGoogleId}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <FormControlLabel
                  checked={formik.values.defaultAccessProfileOpen}
                  name="Default Access Profile Open"
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
                  label={"Default Access Profile Open"}
                  labelPlacement="end"
                  onChange={formik.handleChange}
                />
                <FormControlLabel
                  checked={formik.values.defaultAccessAssetsOpen}
                  name="Default Access Assets Open"
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
                  label={"Default Access Assets Open"}
                  labelPlacement="end"
                />
                <FormControlLabel
                  checked={formik.values.usersCanFree}
                  name="Users can free"
                  control={
                    <Checkbox
                      onChange={(e) =>
                        formik.setFieldValue("usersCanFree", e.target.checked)
                      }
                    />
                  }
                  label={"Users can free"}
                  labelPlacement="end"
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <input
                  onChange={onImage}
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                />
                {preview ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      cursor: "pointer",
                    }}
                    onClick={() => fileRef.current?.click()}
                  >
                    <img
                      src={preview}
                      style={{
                        width: 200,
                        height: '100%',
                        objectFit: "cover",
                        borderRadius: 10,
                      }}
                      alt={"test"}
                    />
                  </Box>
                ) : (
                  <Button
                    variant="text"
                    onClick={() => fileRef.current?.click()}
                  >
                    upload image
                  </Button>
                )}
              </Box>
            </Box>
            <LoadingButton
              loading={loading}
              variant="contained"
              style={{ marginTop: "15px", width: "100%" }}
              type="submit"
              disabled={loading}
            >
              Create App
            </LoadingButton>
          </form>
        </Box>
      </Box>
    </Dialog>
  );
}
