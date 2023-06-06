import React, { useRef, useState } from "react";
import { Box, Button, TextField, Tooltip, Typography } from "@mui/material";
import * as http from "../../http";
import { useParams } from "react-router";
import { useStoreState } from "../../store";
import { useFormik } from "formik";
import { useSnackbar } from "../../context/SnackbarContext";
import { LoadingButton } from "@mui/lab";
import InfoIcon from "@mui/icons-material/Info";

export interface IServices {}
type IFile = {
  file?: File;
  url: string;
};

const firebaseConfigExample = `{
  apiKey: "AIzaSyDQdkvvxKKx4-WrjLQoYf08GFARgi_qO4g",
  authDomain: "ethora-668e9.firebaseapp.com",
  projectId: "ethora-668e9",
  storageBucket: "ethora-668e9.appspot.com",
  messagingSenderId: "972933470054",
  appId: "1:972933470054:web:d4682e76ef02fd9b9cdaa7",
  measurementId: "G-WHM7XRZ4C8"
}`;
function preprocessInputKeysToJson(input: string) {
  // Add double quotes around the keys
  return input.replace(/([\{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
}
export const Services: React.FC<IServices> = ({}) => {
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState({
    _id: "",
    createdAt: "",
    expiresAt: 0,
    filename: "",
    isVisible: true,
    location: "",
    locationPreview: "",
    mimetype: "",
    originalname: "",
    ownerKey: "",
    size: 0,
    updatedAt: "",
    userId: "",
  });
  const { appId } = useParams<{ appId: string }>();
  const app = useStoreState((s) => s.apps.find((app) => app._id === appId));
  const updateApp = useStoreState((s) => s.updateApp);

  const fileRef = useRef<HTMLInputElement>(null);
  const { showSnackbar } = useSnackbar();
  const [googleServisesJson, setGoogleServisesJson] = useState<IFile>({
    file: undefined,
    url: app?.coinImage || "",
  });
  const [googleServisesPlist, setGoogleServisesPlist] = useState<IFile>({
    file: undefined,
    url: app?.coinImage || "",
  });
  const googleServisesJsonRef = useRef<HTMLInputElement>(null);
  const googleServisesPlistRef = useRef<HTMLInputElement>(null);

  const uploadCertificate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("files", e.target.files[0]);
      const fileUploadResp = await http.httpWithAuth().post("/files", fd);
      setCertificate(fileUploadResp.data.results[0]);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleGoogleServisesJsonChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const l = event.target.files[0];
    setGoogleServisesJson({ file: l, url: URL.createObjectURL(l) });
  };
  const handleGoogleServisesPlistChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const l = event.target.files[0];
    setGoogleServisesPlist({ file: l, url: URL.createObjectURL(l) });
  };

  const formik = useFormik({
    initialValues: {
      REACT_APP_FIREBASE_API_KEY: app.REACT_APP_FIREBASE_API_KEY,
      REACT_APP_FIREBASE_AUTH_DOMAIN: app.REACT_APP_FIREBASE_AUTH_DOMAIN,
      REACT_APP_FIREBASE_PROJECT_ID: app.REACT_APP_FIREBASE_PROJECT_ID,
      REACT_APP_FIREBASE_STORAGE_BUCKET: app.REACT_APP_FIREBASE_STORAGE_BUCKET,
      REACT_APP_FIREBASE_MESSAGING_SENDER_ID:
        app.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      REACT_APP_FIREBASE_APP_ID: app.REACT_APP_FIREBASE_APP_ID,
      REACT_APP_FIREBASE_MEASURMENT_ID: app.REACT_APP_FIREBASE_MEASURMENT_ID,
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      return errors;
    },
    onSubmit: async (
      {
        REACT_APP_FIREBASE_API_KEY,
        REACT_APP_FIREBASE_AUTH_DOMAIN,
        REACT_APP_FIREBASE_PROJECT_ID,
        REACT_APP_FIREBASE_STORAGE_BUCKET,
        REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        REACT_APP_FIREBASE_APP_ID,
        REACT_APP_FIREBASE_MEASURMENT_ID,
      },
      { setSubmitting }
    ) => {
      const data = new FormData();
      REACT_APP_FIREBASE_API_KEY &&
        data.append("REACT_APP_FIREBASE_API_KEY", REACT_APP_FIREBASE_API_KEY);
      REACT_APP_FIREBASE_AUTH_DOMAIN &&
        data.append(
          "REACT_APP_FIREBASE_AUTH_DOMAIN",
          REACT_APP_FIREBASE_AUTH_DOMAIN
        );
      REACT_APP_FIREBASE_PROJECT_ID &&
        data.append(
          "REACT_APP_FIREBASE_PROJECT_ID",
          REACT_APP_FIREBASE_PROJECT_ID
        );
      REACT_APP_FIREBASE_STORAGE_BUCKET &&
        data.append(
          "REACT_APP_FIREBASE_STORAGE_BUCKET",
          REACT_APP_FIREBASE_STORAGE_BUCKET
        );
      REACT_APP_FIREBASE_MESSAGING_SENDER_ID &&
        data.append(
          "REACT_APP_FIREBASE_MESSAGING_SENDER_ID",
          REACT_APP_FIREBASE_MESSAGING_SENDER_ID
        );
      REACT_APP_FIREBASE_APP_ID &&
        data.append("REACT_APP_FIREBASE_APP_ID", REACT_APP_FIREBASE_APP_ID);
      REACT_APP_FIREBASE_MEASURMENT_ID &&
        data.append(
          "REACT_APP_FIREBASE_MEASURMENT_ID",
          REACT_APP_FIREBASE_MEASURMENT_ID
        );
      googleServisesJson.file &&
        data.append("googleServicesJson", googleServisesJson.file);
      googleServisesPlist.file &&
        data.append("GoogleServiceInfoPlist", googleServisesPlist.file);
      setSubmitting(true);
      try {
        const res = await http.updateAppSettings(appId, data);
        updateApp(res.data.result);
      } catch (error) {
        showSnackbar("error", "Cannot save settings");
        console.log({ error });
      }
      setSubmitting(false);
    },
  });

  return (
    <Box>
      <Box>
        <Typography
          sx={{ fontWeight: "bold", fontSize: 24, mb: 2 }}
          variant="h2"
        >
          Google sign-in and Firebase analytics
        </Typography>
        <Typography sx={{ fontStyle: "italic" }}>
          Firebase credentials are required to allow your users to sign on via
          Google Account. Also this allows you to track your app usage analytics
          in your Firebase console. These options will be disabled if
          credentials are not provided.
        </Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontWeight: "bold", mb: 1 }}>Web</Typography>
        <Typography sx={{ mb: 1, display: "flex", alignItems: "center" }}>
          Copy paste the configuration from your Firebase Console{" "}
          <Tooltip
            sx={{ ml: 1 }}
            title={
              <Box>
                <Typography sx={{ fontSize: 12 }}>
                  Follow these steps to copy Firebase data:
                </Typography>
                <Typography sx={{ fontSize: 12 }}>1) Your App. </Typography>
                <Typography sx={{ fontSize: 12 }}>
                  2) Project settings.
                </Typography>
                <Typography sx={{ fontSize: 12 }}>3) Web. </Typography>
                <Typography sx={{ fontSize: 12 }}>
                  4) Copy the Firebase data according to the example provided in
                  the input field.
                </Typography>
                <Typography sx={{ fontSize: 12 }}>
                  5) Paste copied data.
                </Typography>
              </Box>
            }
          >
            <InfoIcon color="primary" />
          </Tooltip>
        </Typography>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            id="outlined-configuration"
            placeholder={firebaseConfigExample}
            onChange={(e) => {
              const preprocessedValue = preprocessInputKeysToJson(
                e.target.value
              );
              console.log(JSON.parse(preprocessedValue));
              // console.log(preprocessedValue)
            }}
            multiline
            rows={10}
          />
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: "bold", mb: 1 }}>Android</Typography>

        <Typography sx={{ mb: 1 }}>Google Services JSON</Typography>

        <input
          onChange={handleGoogleServisesJsonChange}
          ref={googleServisesJsonRef}
          type="file"
          accept=".json"
          style={{ display: "none" }}
        />
        <Button
          // disabled={loading}
          color="primary"
          variant="outlined"
          onClick={() => googleServisesJsonRef?.current?.click()}
        >
          {googleServisesJson?.file?.name || "Upload"}
        </Button>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: "bold", mb: 1 }}>iOS</Typography>

        <Typography sx={{ mb: 1 }}>Google Services PLIST</Typography>
        <input
          onChange={handleGoogleServisesPlistChange}
          ref={googleServisesPlistRef}
          type="file"
          accept=".plist"
          style={{ display: "none" }}
        />
        <Button
          // disabled={loading}
          color="primary"
          variant="outlined"
          onClick={() => googleServisesPlistRef?.current?.click()}
        >
          {googleServisesPlist?.file?.name || "Upload"}
        </Button>
      </Box>

      <Box>
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{ fontWeight: "bold", fontSize: 24, mb: 2 }}
            variant="h2"
          >
            Push Notifications
          </Typography>
          <Typography sx={{ fontStyle: "italic" }}>
            Upload the relevant Push Notification certificate to enable push
            alerts for incoming chat messages and other events.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography>Push Notifications certificate (Apple)</Typography>
          <input
            onChange={uploadCertificate}
            ref={fileRef}
            type="file"
            accept="*/*"
            style={{ display: "none" }}
          />
          <Button variant="outlined" onClick={() => fileRef.current?.click()}>
            {certificate.originalname || "Upload"}
          </Button>
        </Box>
        <Box>
          <TextField
            sx={{ width: "100%" }}
            margin="dense"
            label="Firebase Server key"
            name="firebaseServerKey"
            variant="outlined"
            // onChange={formik.handleChange}
            // onBlur={formik.handleBlur}
            // value={formik.values.appUrl}
            // error={!!formik.touched.appUrl && !!formik.errors.appUrl}
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <LoadingButton
          loading={formik.isSubmitting}
          disabled={formik.isSubmitting}
          onClick={() => formik.handleSubmit()}
          variant="contained"
        >
          Save
        </LoadingButton>
      </Box>
    </Box>
  );
};
