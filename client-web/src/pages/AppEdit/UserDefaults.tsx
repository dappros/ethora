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
import { useParams } from "react-router";
export interface IUserDefaults {}

export const UserDefaults: React.FC<IUserDefaults> = ({}) => {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const { appId } = useParams<{ appId: string }>();
  const app = useStoreState((s) => s.apps.find((app) => app._id === appId));
  const updateApp = useStoreState((state) => state.updateApp);
  const setUser = useStoreState((state) => state.setUser);
  const user = useStoreState((state) => state.user);
  const [defaultChatRooms, setDefaultChatRooms] = useState(() =>
    Object.entries(defaultChats).map((item, i) => ({
      ...item[1],
      jid: item[0],
      checked: i === 0,
      disabled: i === 0,
    }))
  );
  const { showSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      appName: "",
      appDescription: "",
      appGoogleId: "",
      defaultAccessProfileOpen: app.defaultAccessProfileOpen,
      defaultAccessAssetsOpen: app.defaultAccessAssetsOpen,
      usersCanFree: app.usersCanFree,
      newUserTokenGift: 0,
      coinsDayliBonus: 0,
      appUrl: "",
    },

    onSubmit: async (
      { defaultAccessAssetsOpen, defaultAccessProfileOpen, usersCanFree },
      { setSubmitting }
    ) => {
      setSubmitting(true);
      const fd = new FormData();
      console.log(
        defaultAccessAssetsOpen,
        defaultAccessProfileOpen,
        usersCanFree
      );

      fd.append("displayName", app.displayName);
      fd.append("defaultAccessAssetsOpen", defaultAccessAssetsOpen.toString());
      fd.append(
        "defaultAccessProfileOpen",
        defaultAccessProfileOpen.toString()
      );
      fd.append("usersCanFree", usersCanFree.toString());
      try {
        const res = await http.updateAppSettings(appId, fd);
        setUser({ ...user, homeScreen: "" });
        updateApp(res.data.result);
      } catch (error) {
        showSnackbar(
          "error",
          "Cannot update the app " + (error.response?.data?.error || "")
        );
      }

      setSubmitting(false);
    },
  });

  const selectChatRooms = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    const r = [...defaultChatRooms];
    r[i].checked = e.target.checked;
    setDefaultChatRooms(r);
  };
  return (
    <Box sx={{ padding: 1 }}>
      <Box sx={{ width: "100%" }}>
        <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box sx={{ mb: 4 }}>
                <Typography sx={{ fontWeight: "bold", mb: 2 }}>
                  Default chat rooms
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "0.25fr 3.5fr 0.25fr",
                      gap: 1,
                      alignItems: "center",
                      fontWeight: "bold",
                      fontSize: 14,
                    }}
                  >
                    <Typography sx={{fontWeight: 'bold', width: 150}}>Title</Typography>
                    <Typography sx={{fontWeight: 'bold'}}>JID</Typography>
                    <Typography sx={{fontWeight: 'bold'}}>Pinned</Typography>

                  </Box>
                  {defaultChatRooms.map((item, i) => {
                    return (
                      <Box
                        key={item.jid}
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "0.25fr 3.5fr 0.25fr",
                          gap: 1,
                          alignItems: "center",
                          fontWeight: "bold",
                          fontSize: 14,
                        }}
                      >
                        <p style={{ width: 150 }}>{item.name}</p>
                        <TextField
                          margin="dense"
                          // label="Email"
                          disabled
                          name="room"
                          fullWidth
                          variant="outlined"
                          value={item.jid}
                        />
                        <Checkbox
                          inputProps={{ "aria-label": "Checkbox" }}
                          onChange={(e) => selectChatRooms(e, i)}
                          checked={item.checked}
                          disabled={item.disabled}
                        />
                      </Box>
                    );
                  })}
                  <Typography sx={{ fontSize: 12 }}>
                    Specify from 1 to 3 chat rooms your users will be subscribed
                    to by default.
                  </Typography>
                  <Typography sx={{ fontSize: 12 }}>
                    "Pinned" means users won't be able to remove them.
                  </Typography>
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
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { sm: "1fr", md: "1fr 1fr" },
                }}
              >
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
          </Box>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <LoadingButton
              loading={formik.isSubmitting}
              disabled={formik.isSubmitting}
              onClick={() => formik.handleSubmit()}
              variant="contained"
            >
              Save
            </LoadingButton>
          </Box>
        </form>
      </Box>
    </Box>
  );
};
