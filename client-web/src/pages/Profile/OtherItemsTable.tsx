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
import Select from "@mui/material/Select";
import { useFormik } from "formik";
import MenuItem from "@mui/material/MenuItem";
import * as http from '../../http'

type TProps = {
  walletAddress: string;
};

type TNftBalance = {
  tokenName: string;
  balance: number | string;
  total: number;
  imagePreview: string;
  contractTokenIds: string[];
  nftId: string;
  tokenType: "NFT";
  nftFileUrl: string;
  nftMetaUrl: string;
  nftOriginalname: string;
  nftMimetype: string;
  createdAt: string;
  updatedAt: string;
  contractAddress: string;
};

type TBalances = TNftBalance[];

export default function OtherItemsTable(props: TProps) {
  const [balances, setBalances] = React.useState<TBalances>();
  React.useEffect(() => {
    if (props.walletAddress) {
      http.getBalance(props.walletAddress).then((response) => {
        // @ts-ignore
        setBalances(response.data.balance.filter(el => el.tokenType === "NFT"));
      });
    }
  }, [props.walletAddress]);

  if (!balances) {
    return null;
  } else {
    return (
      <TableContainer style={{ flex: 1, marginTop: "10px" }}>
        <Box style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" style={{ margin: "16px" }}>
            Items
          </Typography>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
