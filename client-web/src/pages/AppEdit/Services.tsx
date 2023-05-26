import React, { useRef, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import * as http from "../../http";
import { useParams } from "react-router";
import { useStoreState } from "../../store";
import { useFormik } from "formik";
import { useSnackbar } from "../../context/SnackbarContext";
import { LoadingButton } from "@mui/lab";

export interface IServices {}
type IFile = {
  file?: File;
  url: string;
};
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 4, mt: 1, mb: 1 }}>
        <Box >
          <Typography>Google Services JSON</Typography>

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
        <Box >
          <Typography>Google Services PLIST</Typography>
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
      <Box>
        <TextField
          sx={{ width: "100%" }}
          margin="dense"
          label="Google Id (Firebase)"
          name="appUrl"
          variant="outlined"
          // onChange={formik.handleChange}
          // onBlur={formik.handleBlur}
          // value={formik.values.appUrl}
          // error={!!formik.touched.appUrl && !!formik.errors.appUrl}
        />
      </Box>
      <Box>
        <TextField
          sx={{ width: "100%" }}
          margin="dense"
          label="REACT_APP_FIREBASE_API_KEY"
          name="REACT_APP_FIREBASE_API_KEY"
          variant="outlined"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.REACT_APP_FIREBASE_API_KEY}
          error={
            !!formik.touched.REACT_APP_FIREBASE_API_KEY &&
            !!formik.errors.REACT_APP_FIREBASE_API_KEY
          }
        />
      </Box>
      <Box>
        <TextField
          sx={{ width: "100%" }}
          margin="dense"
          label="REACT_APP_FIREBASE_AUTH_DOMAIN"
          name="REACT_APP_FIREBASE_AUTH_DOMAIN"
          variant="outlined"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.REACT_APP_FIREBASE_AUTH_DOMAIN}
          error={
            !!formik.touched.REACT_APP_FIREBASE_AUTH_DOMAIN &&
            !!formik.errors.REACT_APP_FIREBASE_AUTH_DOMAIN
          }
        />
      </Box>
      <Box>
        <TextField
          sx={{ width: "100%" }}
          margin="dense"
          label="REACT_APP_FIREBASE_PROJECT_ID"
          name="REACT_APP_FIREBASE_PROJECT_ID"
          variant="outlined"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.REACT_APP_FIREBASE_PROJECT_ID}
          error={
            !!formik.touched.REACT_APP_FIREBASE_PROJECT_ID &&
            !!formik.errors.REACT_APP_FIREBASE_PROJECT_ID
          }
        />
      </Box>
      <Box>
        <TextField
          sx={{ width: "100%" }}
          margin="dense"
          label="REACT_APP_FIREBASE_STORAGE_BUCKET"
          name="REACT_APP_FIREBASE_STORAGE_BUCKET"
          variant="outlined"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.REACT_APP_FIREBASE_STORAGE_BUCKET}
          error={
            !!formik.touched.REACT_APP_FIREBASE_STORAGE_BUCKET &&
            !!formik.errors.REACT_APP_FIREBASE_STORAGE_BUCKET
          }
        />
      </Box>
      <Box>
        <TextField
          sx={{ width: "100%" }}
          margin="dense"
          label="REACT_APP_FIREBASE_MESSAGING_SENDER_ID"
          name="REACT_APP_FIREBASE_MESSAGING_SENDER_ID"
          variant="outlined"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.REACT_APP_FIREBASE_MESSAGING_SENDER_ID}
          error={
            !!formik.touched.REACT_APP_FIREBASE_MESSAGING_SENDER_ID &&
            !!formik.errors.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
          }
        />
      </Box>
      <Box>
        <TextField
          sx={{ width: "100%" }}
          margin="dense"
          label="REACT_APP_FIREBASE_APP_ID"
          name="REACT_APP_FIREBASE_APP_ID"
          variant="outlined"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.REACT_APP_FIREBASE_APP_ID}
          error={
            !!formik.touched.REACT_APP_FIREBASE_APP_ID &&
            !!formik.errors.REACT_APP_FIREBASE_APP_ID
          }
        />
      </Box>
      <Box>
        <TextField
          sx={{ width: "100%" }}
          margin="dense"
          label="REACT_APP_FIREBASE_MEASURMENT_ID"
          name="REACT_APP_FIREBASE_MEASURMENT_ID"
          variant="outlined"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.REACT_APP_FIREBASE_MEASURMENT_ID}
          error={
            !!formik.touched.REACT_APP_FIREBASE_MEASURMENT_ID &&
            !!formik.errors.REACT_APP_FIREBASE_MEASURMENT_ID
          }
        />
      </Box>
      <Typography sx={{ fontSize: 12 }}>
        On Free plan, you use our default Ethora integrations. To publish to
        Appstore, you need to register your own accounts in these services and
        upgrade.
      </Typography>
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
