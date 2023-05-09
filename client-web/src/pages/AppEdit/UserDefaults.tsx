import { LoadingButton } from "@mui/lab";
import {
  Box,
  Checkbox,
  DialogTitle,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useSnackbar } from "../../context/SnackbarContext";
import { useStoreState } from "../../store";
import * as http from "../../http";
import { defaultChats } from "../../config/config";
export interface IUserDefaults {}

export const UserDefaults: React.FC<IUserDefaults> = ({}) => {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const setApp = useStoreState((state) => state.setApp);
  const setUser = useStoreState((state) => state.setUser);
  const user = useStoreState((state) => state.user);

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
      appDescription && fd.append("appDescription", appDescription.toString());
      appGoogleId && fd.append("appGoogleId", appGoogleId.toString());
      fd.append("defaultAccessAssetsOpen", defaultAccessAssetsOpen.toString());
      fd.append(
        "defaultAccessProfileOpen",
        defaultAccessProfileOpen.toString()
      );
      fd.append("usersCanFree", usersCanFree.toString());
      appUrl && fd.append("appUrl", appUrl.toString());

      http
        .createApp(fd)
        .then((response) => {
          setApp(response.data.app);
          setUser({ ...user, homeScreen: "" });
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
  return (
    <Box sx={{ padding: 1 }}>
      <Box sx={{ width: "100%" }}>
        <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box>
                <Typography sx={{ fontWeight: "bold" }}>
                  Default chat rooms
                </Typography>
                <Box>
                  {Object.entries(defaultChats).map((item) => {
                    return (
                      <Box
                        key={item[0]}
                        sx={{ display: "flex", gap: 1, fontWeight: "bold" , fontSize: 14}}
                      >
                        <p>{item[1].name}</p>
                        <p>{item[0]}</p>
                        <Checkbox
                          inputProps={{ "aria-label": "Checkbox" }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: "bold" }}>
                  Default profile security settings
                </Typography>
                <Typography sx={{ fontSize: 10 }}>
                  These are the default permissions to be applied to all Users
                  created in your App. Keep the recommended settings if you are
                  not sure and you can come back to this later.
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
                    <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
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
          </Box>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
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
  );
};
