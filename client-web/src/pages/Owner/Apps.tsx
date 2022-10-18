import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from "@mui/material/Box";
import { IconButton, Typography } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {useStoreState} from '../../store'

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function BasicTable() {
  const apps = useStoreState(state => state.apps)
  return (
    <TableContainer component={Paper} style={{maxWidth: 900, margin: '0 auto'}}>
      <Box style={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h6" style={{ margin: "16px" }}>
          Items
        </Typography>
        <IconButton onClick={() => {}} size="large" color="success">
          <AddCircleIcon fontSize="large"></AddCircleIcon>
        </IconButton>
      </Box>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell width={200}>appName</TableCell>
            <TableCell align="right">AssetsOpen</TableCell>
            <TableCell align="right">ProfileOpen</TableCell>
            <TableCell align="right">usersCanFree</TableCell>
            <TableCell align="right">createdAt</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {apps.map((app) => (
            <TableRow
              key={app._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {app.appName}
              </TableCell>
              <TableCell align="right">{app.defaultAccessAssetsOpen.toString()}</TableCell>
              <TableCell align="right">{app.defaultAccessProfileOpen.toString()}</TableCell>
              <TableCell align="right">{app.usersCanFree.toString()}</TableCell>
              <TableCell align="right">{app.createdAt}</TableCell>
              <TableCell align="right">Edit</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
