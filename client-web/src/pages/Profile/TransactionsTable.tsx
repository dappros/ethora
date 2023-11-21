import * as React from "react"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { ITransaction, TTransactions } from "./types"
import { Typography } from "@mui/material"
import { useHistory } from "react-router"

type TProperties = {
  transactions: ITransaction[]
}

export function TransactionsTable(properties: TProperties) {
  const history = useHistory()

  return (
    <TableContainer style={{ flex: 1, marginTop: "10px" }} component={Paper}>
      <Typography variant="h6" style={{ margin: "16px" }}>
        Transactions
      </Typography>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Contract Type</TableCell>
            <TableCell>Contract Name</TableCell>
            <TableCell>Action Type</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>BlockNumber</TableCell>
            <TableCell>Transaction Hash</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {properties.transactions.map((row) => (
            <TableRow
              key={row._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="right">{row.tokenId}</TableCell>
              <TableCell align="right">{row.tokenName}</TableCell>
              <TableCell align="right">{row.type}</TableCell>
              <TableCell
                style={{ cursor: "pointer", textDecoration: "underline" }}
                align="right"
                onClick={() => history.push("/explorer/address/" + row.from)}
              >
                {row.from}
              </TableCell>
              <TableCell
                style={{ cursor: "pointer", textDecoration: "underline" }}
                align="right"
                onClick={() => history.push("/explorer/address/" + row.to)}
              >
                {row.to}
              </TableCell>
              <TableCell align="right">{row.blockNumber}</TableCell>
              <TableCell
                style={{ cursor: "pointer", textDecoration: "underline" }}
                align="right"
                onClick={() =>
                  history.push("/explorer/transactions/" + row.transactionHash)
                }
              >
                {row.transactionHash}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
