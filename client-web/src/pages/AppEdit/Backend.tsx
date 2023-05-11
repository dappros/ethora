import { Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useParams } from "react-router";
import { useStoreState } from "../../store";
import { rotateAppJwt } from "../../http";
import { useSnackbar } from "../../context/SnackbarContext";

export interface IBackend {}

const sectionStyle = {
  mt: 2,
};

export const Backend: React.FC<IBackend> = ({}) => {
  const { appId } = useParams<{ appId: string }>();
  const app = useStoreState((s) => s.apps.find((app) => app._id === appId));
  const updateApp = useStoreState((state) => state.updateApp);
  const {showSnackbar} = useSnackbar()
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      dpApi: "",
      webAppUrl: "",
      shortLinkUrl: "",
      blockchainRpc: "",
      chatServerUrl: "",
      chatServerAdminLogin: "",
      chatServerAdminPassword: "",
      ipfs: "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      return errors;
    },
    onSubmit: ({}) => {},
  });
  const downloadJWT = () => {
    const url = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify({ appJwt: app.appToken })
    )}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.open(url, "_blank");
  };

  const rotateJWT = async () => {
    setLoading(true);
    try {
      const res = await rotateAppJwt(app._id);
      updateApp(res.data.app);
      showSnackbar('success', 'JWT rotated')
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  };
  return (
    <Box>
      <Box sx={sectionStyle}>
        <Typography sx={{ fontWeight: "bold" }}>API</Typography>
        <Box>
          <TextField
            sx={{ width: "100%" }}
            margin="dense"
            label="Dappros Platform URL"
            name="dpApi"
            variant="outlined"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.dpApi}
            error={!!formik.touched.dpApi && !!formik.errors.dpApi}
          />
          <Typography sx={{ fontSize: 12 }}>
            Dappros Platform Api is used for many core features of your
            application to make web3 transactions faster
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>JWT Token</Typography>
            <Typography sx={{ fontSize: 12 }}>
              JWT is your authentication key used by your application to
              authenticate with Dappros Platform API
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginLeft: 9,
              gap: 2,
            }}
          >
            <Button disabled={loading} variant="outlined" onClick={downloadJWT}>
              Download
            </Button>
            <Button
              disabled={loading}
              variant="outlined"
              color={loading ? "secondary" : "error"}
              onClick={rotateJWT}
            >
              Rotate
            </Button>
          </Box>
        </Box>
      </Box>
      <Box sx={sectionStyle}>
        <Typography sx={{ fontWeight: "bold" }}>Web App and Links</Typography>
        <Box>
          <TextField
            fullWidth
            margin="dense"
            label="Web App URL"
            name="webAppUrl"
            variant="outlined"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.webAppUrl}
            error={!!formik.touched.webAppUrl && !!formik.errors.webAppUrl}
          />
          <Typography sx={{ fontSize: 12 }}>
            URL of your web application. This is used in password reset,
            e-mails, etc.
          </Typography>
        </Box>
        <Box sx={sectionStyle}>
          <TextField
            fullWidth
            margin="dense"
            label="Short Link URL"
            name="shortLinkUrl"
            variant="outlined"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.shortLinkUrl}
            error={
              !!formik.touched.shortLinkUrl && !!formik.errors.shortLinkUrl
            }
          />
          <Typography sx={{ fontSize: 12 }}>
            This is used for short URL's, for example links to user profile,
            chat rooms and documents.
          </Typography>
        </Box>
      </Box>
      <Box sx={sectionStyle}>
        <Typography sx={{ fontWeight: "bold" }}>Blockchain</Typography>
        <Box>
          <TextField
            fullWidth
            margin="dense"
            label="Blockchain RPC"
            name="blockchainRpc"
            variant="outlined"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.blockchainRpc}
            error={
              !!formik.touched.blockchainRpc && !!formik.errors.blockchainRpc
            }
          />
          <Typography sx={{ fontSize: 12 }}>
            In standart configuration, this is a gateway to a profile blockchain
            or L2 chain (Ethereum based) used by your application
          </Typography>
        </Box>
      </Box>
      <Box sx={sectionStyle}>
        <Typography sx={{ fontWeight: "bold" }}>Chat</Typography>
        <TextField
          fullWidth
          margin="dense"
          label="Chat Server URL"
          name="blockchainRpc"
          variant="outlined"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.chatServerUrl}
          error={
            !!formik.touched.chatServerUrl && !!formik.errors.chatServerUrl
          }
        />
        <TextField
          fullWidth
          margin="dense"
          label="Chat Server Admin Login"
          name="chatServerAdminLogin"
          variant="outlined"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.chatServerAdminLogin}
          error={
            !!formik.touched.chatServerAdminLogin &&
            !!formik.errors.chatServerAdminLogin
          }
        />
        <TextField
          fullWidth
          margin="dense"
          label="Chat Server Admin Password"
          name="chatServerAdminPassword"
          variant="outlined"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.chatServerAdminPassword}
          error={
            !!formik.touched.chatServerAdminPassword &&
            !!formik.errors.chatServerAdminPassword
          }
        />
      </Box>
      <Box sx={sectionStyle}>
        <Typography sx={{ fontWeight: "bold" }}>IPFS</Typography>
        <TextField
          fullWidth
          margin="dense"
          label="IPFS"
          name="ipfs"
          variant="outlined"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.ipfs}
          error={!!formik.touched.ipfs && !!formik.errors.ipfs}
        />
        <Typography sx={{ fontSize: 12 }}>
          IPFS is used for decentralized storage.
        </Typography>
      </Box>
    </Box>
  );
};
