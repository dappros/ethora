import React, { useState, useRef } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button, Icon, NativeSelect, Typography } from "@mui/material";
import { useState } from "../../store";
import { IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box } from "@mui/system";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { useFormik } from "formik";
import MenuItem from "@mui/material/MenuItem";
import * as http from "../../http";

export default function ItemsTable() {
<<<<<<< HEAD
  const [itemModal, setItemModal] = React.useState(false);
  const [preview, setPreview] = React.useState<any>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = React.useState("");
  const balances = useState((state) =>
=======
  const [itemModal, setItemModal] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState("");
  const balances = useStoreState((state) =>
>>>>>>> 0be3fbdaee04976ef1d9a17d3e5a7955a4dd5b85
    state.balance.filter((el) => {
      return el.tokenType === "NFT";
    })
  );
<<<<<<< HEAD
  const user = useState((state) => state.user);
  const setBalance = useState((state) => state.setBalance);
=======
  const user = useStoreState((state) => state.user);
  const setBalance = useStoreState((state) => state.setBalance);
>>>>>>> 0be3fbdaee04976ef1d9a17d3e5a7955a4dd5b85

  const validate = (values: Record<string, string>) => {
    const errors: Record<string, string> = {};

    if (!values.tokenName) {
      errors.tokenName = "Required";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      tokenName: "",
      rarity: "1",
    },
    validate,
    onSubmit: async (values) => {
      console.log(values);
      if (!file) {
        setFileError("required");
        return;
      }

      const fd = new FormData();
      fd.append("files", file);
      http
        .uploadFile(fd)
        .then(async (res) => {
          const depRes = await http.nftDeploy(
            values.tokenName,
            res.data.results[0]._id,
            values.rarity
          );
          const balanceResp = await http.getBalance(user.walletAddress);
          setBalance(balanceResp.data.balance);
          onCloseModal();
        })
        .catch((error) => console.log(error));
    },
  });

  const addItem = () => {
    setItemModal(true);
  };

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

  const onCloseModal = () => {
    formik.resetForm();
    setPreview(null);
    setFile(null);
    setItemModal(false);
    setFileError("");
  };

  return (
    <TableContainer style={{ flex: 1, marginTop: "10px" }}>
      <Box style={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h6" style={{ margin: "16px" }}>
          Items
        </Typography>
        <IconButton onClick={addItem} size="large" color="success">
          <AddCircleIcon fontSize="large"></AddCircleIcon>
        </IconButton>
      </Box>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center" width={200}>
              Image
            </TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Balance</TableCell>
            <TableCell align="center">Total</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {balances.map((row) => (
            <TableRow key={row.contractAddress}>
              <TableCell style={{ width: "200" }}>
                <img alt="" src={row.imagePreview}></img>
              </TableCell>
              <TableCell align="center">{row.tokenName}</TableCell>
              <TableCell align="center">{row.balance}</TableCell>
              <TableCell align="center">{row.total}</TableCell>
              <TableCell align="center">
                <Button>Transfer</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog onClose={() => {}} maxWidth={false} open={itemModal}>
        <Box style={{ width: "400px" }}>
          <DialogTitle
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            Create new Item Token
            <IconButton onClick={onCloseModal}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Box
            sx={{
              width: "100%",
              typography: "body1",
              padding: 1,
              display: "flex",
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
                  border: "1px solid gray",
                  borderRadius: "10px",
                  height: "100%",
                  backgroundImage: preview ? `url(${preview})` : "none",
                  backgroundSize: "cover",
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
                ></input>
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
                  console.log("onChange ", e);
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
                    console.log(e)
                    formik.handleChange(e)
                  }}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </NativeSelect>
              </FormControl>
              <Box
                sx={{ margin: 2, display: "flex", justifyContent: "center" }}
              >
                <Button type="submit" variant="contained">
                  Create
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Dialog>
    </TableContainer>
  );
}
