import React, { useRef, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import * as http from "../../http";
import { useParams } from "react-router";
import { useStoreState } from "../../store";

export interface IServices {}

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

  const fileRef = useRef<HTMLInputElement>(null);
  const uploadCertificate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    console.log(e);
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
      <Typography sx={{ fontSize: 12 }}>
        On Free plan, you use our default Ethora integrations. To publish to
        Appstore, you need to register your own accounts in these services and
        upgrade.
      </Typography>
    </Box>
  );
};
