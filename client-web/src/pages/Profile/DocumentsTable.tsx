import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button, Icon, NativeSelect, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useStoreState } from "../../store";
import { IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box } from "@mui/system";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useFormik } from "formik";
import * as http from "../../http";
import TransferItemsModal from "./TransferItemsModal";
import { TBalance } from "../../store";
import DocumentsCreateModal from "./DocumentsCreateModal";

export default function DocumentsTable() {
  const [open, setOpen] = React.useState(false);
  const [documents, setDocuments] = React.useState([]);
  const user = useStoreState((state) => state.user);

  React.useEffect(() => {
    http
      .httpWithAuth()
      .get(`/docs/${user.walletAddress}`)
      .then((result) => {
        console.log(result);
        setDocuments(result.data.results);
      });
  }, []);

  return (
    <TableContainer style={{ flex: 1, marginTop: "10px" }}>
      <Box style={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h6" style={{ margin: "16px" }}>
          Documents
        </Typography>
        <IconButton onClick={() => setOpen(true)} size="large" color="success">
          <AddCircleIcon fontSize="large"></AddCircleIcon>
        </IconButton>
      </Box>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Document Name</TableCell>
            <TableCell align="center">File</TableCell>
            <TableCell align="center">Is Burnable</TableCell>
            <TableCell align="center">isFilesMutableByAdmin</TableCell>
            <TableCell align="center">isFilesMutableByOwner</TableCell>
            <TableCell align="center">isSignable</TableCell>
            <TableCell align="center">isSignatureRevoсable</TableCell>
            <TableCell align="center">isTransferable</TableCell>
            <TableCell align="center">admin</TableCell>
            <TableCell align="center">owner</TableCell>
            <TableCell align="center">updatedAt</TableCell>
            <TableCell align="center">createdAt</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((row) => (
            <TableRow key={row.contractAddress}>
              <TableCell align="center">{row.documentName}</TableCell>
              <TableCell align="center">{row.files[0]}</TableCell>
              <TableCell align="center">{row.isBurnable.toString()}</TableCell>
              <TableCell align="center">
                {row.isFilesMutableByAdmin.toString()}
              </TableCell>
              <TableCell align="center">
                {row.isFilesMutableByOwner.toString()}
              </TableCell>
              <TableCell align="center">{row.isSignable.toString()}</TableCell>
              <TableCell align="center">
                {row.isSignatureRevoсable.toString()}
              </TableCell>
              <TableCell align="center">
                {row.isTransferable.toString()}
              </TableCell>
              <TableCell align="center">{row.admin}</TableCell>
              <TableCell align="center">{row.owner}</TableCell>
              <TableCell align="center">{row.updatedAt}</TableCell>
              <TableCell align="center">{row.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {open && (
        <DocumentsCreateModal
          setDocuments={(doc) => setDocuments([...documents, doc])}
          open={open}
          setOpen={setOpen}
        />
      )}
    </TableContainer>
  );
}
