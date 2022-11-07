import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { NativeSelect } from "@mui/material";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { httpWithAuth } from "../../http";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import ChageImage from "./ChangeImage";
import defUserImage from "../../assets/images/def-ava.png";

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TransferItemsModal({ open, setOpen }: TProps) {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      transferAmount: "",
      to: "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.to) {
        errors.to = "Required";
      }

      return errors;
    },
    onSubmit: (values) => {
      setLoading(true);
      httpWithAuth()
        .post("tokens/transfer/items", {
          nftId: "",
          receiverWallet: "",
          amount: "",
        })
        .finally(() => setLoading(false));
    },
  });

  return (
    <Dialog onClose={() => {}} open={open}>
      <Box style={{ width: "400px" }}>
        <DialogTitle
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          Transfer Item
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box sx={{ width: "100%", typography: "body1", padding: 1 }}>
          <form onSubmit={formik.handleSubmit}>
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Transfer Amount
              </InputLabel>
              <NativeSelect
                inputProps={{
                  name: "transferAmount",
                  id: "uncontrolled-native",
                }}
                onChange={(e) => {
                  formik.setFieldValue("transferAmount", e.target.value);
                }}
              >
                <option key={1} value={1}>
                  1
                </option>
                {/* {apps.map((app) => {
                    return (
                      <option key={app._id} value={app._id}>
                        {app.appName}
                      </option>
                    );
                  })} */}
              </NativeSelect>
            </FormControl>
            <TextField
              fullWidth
              error={formik.touched.to && formik.errors.to ? true : false}
              helperText={
                formik.touched.to && formik.errors.to ? formik.errors.to : ""
              }
              margin="dense"
              label="Recipient Wallet Address"
              name="to"
              variant="standard"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.to}
            />
            <Box style={{ display: "flex", justifyContent: "flex-end" }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={loading}
              >
                Send
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </Box>
    </Dialog>
  );
}
