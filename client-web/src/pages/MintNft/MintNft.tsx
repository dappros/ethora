import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  NativeSelect,
  TextField,
} from "@mui/material";
import React from "react";
import { useStoreState } from "../../store";
import * as http from "../../http";
import { useFormik } from "formik";

export interface IMintNft {}

export const MintNft: React.FC<IMintNft> = ({}) => {
  const [preview, setPreview] = React.useState<any>(null);
  const [fileError, setFileError] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);

  const setBalance = useStoreState((state) => state.setBalance);
  const user = useStoreState((state) => state.user);

  const fileRef = React.useRef<HTMLInputElement>(null);

  const onImage = (event: any) => {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e) {
          if (e.target?.result) {
            setPreview(e.target.result);
          }
        }
      };
      setFileError("");
      setFile(input.files[0]);
      reader.readAsDataURL(input.files[0]);
    }
  };

  const formik = useFormik({
    initialValues: {
      tokenName: "",
      rarity: "1",
    },
    validate: (values: Record<string, string>) => {
      const errors: Record<string, string> = {};

      if (!values.tokenName) {
        errors.tokenName = "Required";
      }

      return errors;
    },
    onSubmit: async (values) => {
      if (!file) {
        setFileError("required");
        return;
      }

      const fd = new FormData();
      fd.append("files", file);

      setLoading(true);
      http
        .uploadFile(fd)
        .then(async (res) => {
          await http.nftDeploy(
            values.tokenName,
            res.data.results[0]._id,
            values.rarity
          );
          const balanceResp = await http.getBalance(user.walletAddress);
          setBalance(balanceResp.data.balance);
        })
        .finally(() => setLoading(false));
    },
  });

  return (
    <Box>
      <Box style={{ width: '100%' }}>
       
        <Box
          sx={{
            width: "50%",
            typography: "body1",
            padding: 1,
            margin: 'auto'
            // display: "flex",
          }}
        >
          <Box style={{ flex: "1", padding: "5px", marginBottom: "10px" }}>
            <Box
              style={{
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "end",
                border: preview ? 'none' : "1px solid gray",
                borderRadius: "10px",
                height: "300px",
                backgroundImage: preview ? `url(${preview})` : "none",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <input
                onChange={onImage}
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
              />
              <Button
                color="secondary"
                variant="contained"
                onClick={() => fileRef.current?.click()}
              >
                upload image
              </Button>
              {fileError ? (
                <Box style={{ color: "red" }}>File is required</Box>
              ) : null}
            </Box>
          </Box>
          <form style={{ flex: "1" }} onSubmit={formik.handleSubmit}>
            <TextField
              margin="dense"
              inputProps={{
                autoComplete: "off",
              }}
              label="Token Name"
              name="tokenName"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => {
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              error={
                formik.touched.tokenName && Boolean(formik.errors.tokenName)
              }
              helperText={
                formik.touched.tokenName && formik.errors.tokenName
                  ? formik.errors.tokenName
                  : ""
              }
            />
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Rarity
              </InputLabel>
              <NativeSelect
                inputProps={{
                  name: "rarity",
                  id: "uncontrolled-native",
                }}
                onChange={(e) => {
                  console.log(e);
                  formik.handleChange(e);
                }}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </NativeSelect>
            </FormControl>
            <Box sx={{ margin: 2, display: "flex", justifyContent: "center" }}>
              <LoadingButton
                loading={loading}
                type="submit"
                variant="contained"
              >
                Create
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};
