import React, { useState } from "react";
import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  Box,
  DialogTitle,
  IconButton,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
  Button,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { agreeWithTerms } from "../http";
import Tnc from "../pages/Signon/Tnc";
import { useStoreState } from "../store";
import CloseIcon from "@mui/icons-material/Close";

export interface IRegisterCompanyModal {
  open: boolean;
  onClose: () => void;
}

export const RegisterCompanyModal: React.FC<IRegisterCompanyModal> = ({
  open,
  onClose,
}) => {
  const user = useStoreState((state) => state.user);
  const setUser = useStoreState((state) => state.setUser);

  const [termsOpen, setTermsOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formik = useFormik({
    initialValues: {
      companyName: "",
    },
    onSubmit: async ({ companyName }) => {
      setLoading(true);
      try {
        const res = await agreeWithTerms(companyName);
        setUser({ ...user, isAgreeWithTerms: true });
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    },
  });
  return (
    <Dialog onClose={onClose} maxWidth={false} open={open}>
      <Box style={{ width: "400px" }}>
        <IconButton
          sx={{ position: "absolute", top: 0, right: 0 }}
          disabled={loading}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingLeft: 1,
          }}
        >
          Owner Registration
        </DialogTitle>
        <Box sx={{ width: "100%", typography: "body1", padding: 1 }}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              margin="dense"
              label="Company Name"
              name="companyName"
              type="text"
              fullWidth
              inputProps={{
                autoComplete: "off",
              }}
              variant="standard"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.companyName && Boolean(formik.errors.companyName)
              }
              helperText={
                formik.touched.companyName && formik.errors.companyName
                  ? formik.errors.companyName
                  : ""
              }
            />

            <FormGroup>
              <FormControlLabel
                value="I agree to the above terms and conditions"
                control={
                  <Checkbox
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                }
                label="I agree to the above terms and conditions"
                labelPlacement="end"
              />
            </FormGroup>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Typography
                onClick={(e) => {
                  setTermsOpen(true);
                }}
                sx={{
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: 10,
                }}
              >
                Terms and Conditions
              </Typography>
            </Box>
            {!!error && <Alert severity="error">{error}</Alert>}
            <Box sx={{ margin: 2, display: "flex", justifyContent: "center" }}>
              <LoadingButton
                loading={loading}
                variant="contained"
                type="submit"
                disabled={loading || !termsAccepted}
              >
                Register
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </Box>
      <Dialog
        onClose={() => setTermsOpen(false)}
        maxWidth={false}
        open={termsOpen}
      >
        <Box sx={{ width: 800 }}>
          <Tnc
            setTermsOpen={(isOpen: boolean) => setTermsOpen(isOpen)}
            firstName={user.firstName}
            lastName={user.lastName}
            email={user.lastName}
            company="company"
          />
        </Box>
      </Dialog>
    </Dialog>
  );
};
