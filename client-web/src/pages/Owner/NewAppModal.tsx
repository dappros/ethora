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
import { Button, Typography } from "@mui/material";
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
  const { showSnackbar } = useSnackbar();
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
      appUrl: "",
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
      appUrl,
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
      fd.append("appUrl", appUrl);
      http
        .createApp(fd)
        .then((response) => {
          setApp(response.data.app);
          setOpen(false);
        })
        .catch((e) => {
          showSnackbar(
            "error",
            "Cannot create the app " + (e.response?.data?.error || "")
          );
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
      <Box sx={{ padding: 1, }}>
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
            {/* <Box>
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
            </Box> */}
            <Box>
              <TextField
                sx={{ width: "100%" }}
                margin="dense"
                label="App Url"
                name="appUrl"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.appUrl}
                error={!!formik.touched.appUrl && !!formik.errors.appUrl}
              />
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box>
                  <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
                    Default Permissions
                  </Typography>
                  <Typography sx={{ fontSize: 10 }}>
                    These are the default permissions to be applied to all Users
                    created in your App. Keep the recommended settings if you are not sure and you
                    can come back to this later.
                  </Typography>
                 
                </Box>
                <Box>
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
                    label={
                      <Typography sx={{ fontWeight: "bold", fontSize: 14, }}>
                        Profiles Open ("defaultAccessProfileOpen")
                      </Typography>
                    }
                    labelPlacement="end"
                    onChange={formik.handleChange}
                  />
                  <Typography sx={{ fontSize: 10 }}>
                    If enabled, your users profiles can be viewed by any other
                    users and automated agents who follow a correct permanent
                    link.
                  </Typography>
                  <Typography sx={{ fontSize: 10 }}>
                    This is better for social discovery and social commerce but
                    you can disable this if you prefer a tighter security.
                  </Typography>
                  <Typography sx={{ fontSize: 10 }}>
                    This is a default setting for all newly created users. Users
                    will be able to change this later themselves.
                  </Typography>
                </Box>
                <Box>
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
                    label={
                      <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
                        Assets Visible ("defaultAccessAssetsOpen")
                      </Typography>
                    }
                    labelPlacement="end"
                  />

                  <Typography sx={{ fontSize: 10 }}>
                    If enabled, all of your users assets (such as Tokens,
                    Documents and Data) can be viewed by any other users and
                    automated agents who are able to read your user's profile.
                  </Typography>
                  <Typography sx={{ fontSize: 10 }}>
                    If disabled, your user needs to explicitly share each asset
                    via a special link.
                  </Typography>
                  <Typography sx={{ fontSize: 10 }}>
                    This is a default setting for all newly created users. Users
                    will be able to change this later themselves.
                  </Typography>
                </Box>
                <Box>
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
                    label={
                      <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
                        Self-Sovereignty ("usersCanFree")
                      </Typography>
                    }
                    labelPlacement="end"
                  />

                  <Typography sx={{ fontSize: 10 }}>
                    If enabled, your users can take over management of their own
                    account and make it decoupled from your App.
                  </Typography>
                  <Typography sx={{ fontSize: 10 }}>
                    Most business applications will prefer this switched off so
                    that users account and wallet only works within your App.
                  </Typography>
                  <Typography sx={{ fontSize: 10 }}>
                    This is a default setting for all newly created users. Users
                    will be able to change this later themselves.
                  </Typography>
                </Box>
              </Box>
              {/* <Box
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
                        height: "100%",
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
              </Box> */}
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
