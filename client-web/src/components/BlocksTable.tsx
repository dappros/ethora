import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Typography, useTheme } from "@mui/material";
import { useHistory } from "react-router";
import { IBlock } from "../pages/Profile/types";
import { truncateString } from "../utils";

type TProps = {
  blocks: IBlock[];
};

export const BlocksTable: React.FC<TProps> = ({ blocks }) => {
  const history = useHistory();
  const theme = useTheme();
  return (
    <Box sx={{ padding: '10px' }}>
      <TableContainer
        sx={{
          flex: 1,
          marginTop: "10px",
          border: "3px solid " + theme.palette.primary.main,
          borderRadius: '10px',
        }}
        component={Paper}
      >
        <Typography variant="h6" style={{ margin: "16px" }} color={"primary"}>
          Blocks
        </Typography>
        <div
          style={{
            height: 3,
            backgroundColor: theme.palette.primary.main,
            margin: "5px",
            borderRadius: 5,
          }}
        />
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Block Number</TableCell>
              <TableCell align="center">Timestamp</TableCell>
              <TableCell align="center">TXN</TableCell>
              <TableCell align="center">Uncles</TableCell>
              <TableCell align="left">Miner</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blocks.map((row) => (
              <TableRow
                key={row.number}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  align="center"
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={() => history.push("/explorer/block/" + row.number)}
                >
                  {row.number}
                </TableCell>
                <TableCell align="center">{row.timestamp}</TableCell>
                <TableCell align="center">{row.transactions.length}</TableCell>

                <TableCell align="center">{row.uncles.length}</TableCell>
                <TableCell style={{ overflowX: "hidden" }} align="left">
                  {row.miner}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
