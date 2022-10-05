import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button, Icon, Typography } from "@mui/material";
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
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useFormik } from "formik";
import MenuItem from "@mui/material/MenuItem";

const validate = (values: Record<string, string>) => {
  const errors: Record<string, string> = {};

  if (!values.tokenName) {
    errors.tokenName = "Required";
  }

  return errors;
};

export default function ItemsTable() {
  const [itemModal, setItemModal] = React.useState(false);
  const [preview, setPreview] = React.useState<any>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const balances = useState((state) =>
    state.balance.filter((el) => {
      return el.tokenType === "NFT";
    })
  );

  const formik = useFormik({
    initialValues: {
      tokenName: "",
      rarity: "",
    },
    validate,
    onSubmit: async (values) => {},
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
      setFile(input.files[0]);
      reader.readAsDataURL(input.files[0]);
    }
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
            <IconButton onClick={() => setItemModal(false)}>
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
            <Box style={{ flex: "1", padding: "5px" }}>
              <Box
                style={{
                  padding: "10px",
                  display: "flex",
                  alignItems: "end",
                  justifyContent: "center",
                  border: "1px solid gray",
                  borderRadius: "10px",
                  height: "100%",
                  backgroundImage: preview ? `url(${preview})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <input
                  onChange={onImage}
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                ></input>
                <Button color="secondary" variant="contained" onClick={() => fileRef.current?.click()}>upload image</Button>
              </Box>
            </Box>
            <form style={{ flex: "1" }} onSubmit={formik.handleSubmit}>
              <TextField
                margin="dense"
                inputProps={{
                  autoComplete: "off",
                }}
                label="Token Name"
                name="tokeName"
                type="text"
                fullWidth
                variant="standard"
                onChange={formik.handleChange}
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
              <FormControl style={{ width: "100%" }} variant="standard">
                <InputLabel id="demo-simple-select-standard-label">
                  Rarity
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  fullWidth
                  value={1}
                  label="Rarity"
                  onChange={() => {}}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                </Select>
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
