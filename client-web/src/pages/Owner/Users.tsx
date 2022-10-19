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
import NoDataImage from "../../componets/NoDataImage";

export default function BasicTable() {
  const apps = useStoreState(state => state.apps)
  return (
    <TableContainer component={Paper} style={{maxWidth: 900, margin: '0 auto'}}>
      <Box style={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h6" style={{ margin: "16px" }}>
          Users
        </Typography>
        <IconButton onClick={() => {}} size="large">
          <AddCircleIcon fontSize="large"></AddCircleIcon>
        </IconButton>
      </Box>
      <Box style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <NoDataImage></NoDataImage>
        <Typography style={{marginTop: '20px', marginBottom: '20px'}}>Users not found.</Typography>
      </Box>
      {/* <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
              <TableCell align="right">{new Date(app.createdAt).toDateString()}</TableCell>
              <TableCell align="right">Edit</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
    </TableContainer>
  );
}
