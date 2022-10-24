import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { IconButton, Typography } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useStoreState } from "../../store";
import NoDataImage from "../../componets/NoDataImage";
import NewAppModal from "./NewAppModal";
import Button from '@mui/material/Button';
import DeleteAppModal from './DeletAppModal';
import EditAppModal from "./EditAppModal";

export default function BasicTable() {
  const apps = useStoreState((state) => state.apps)
  const [open, setOpen] = React.useState(false)
  const [showDelete, setShowDelete] = React.useState(false)
  const [showEdit, setShowEdit] = React.useState(false)
  const [currentApp, setCurrentApp] = React.useState({
    _id: '',
    appName: '',
    appDescription: '',
    appGoogleId: '',
    defaultAccessProfileOpen: false,
    defaultAccessAssetsOpen: false,
    usersCanFree: false
  })

  const onDelete = (app: any) => {
    setCurrentApp(app)
    setShowDelete(true)
  }

  const onEdit = (app: any) => {
    setCurrentApp(app)
    setShowEdit(true)
  }

  return (
    <TableContainer
      component={Paper}
      style={{ maxWidth: 900, margin: "0 auto" }}
    >
      <Box style={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h6" style={{ margin: "16px" }}>
          Apps
        </Typography>
        <IconButton onClick={() => setOpen(true)} size="large">
          <AddCircleIcon fontSize="large"></AddCircleIcon>
        </IconButton>
      </Box>
      { apps.length === 0 && (
        <Box style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <NoDataImage></NoDataImage>
          <Typography style={{marginTop: '20px', marginBottom: '20px'}}>You have not created any apps.</Typography>
        </Box>
      ) }

      {
        apps.length > 0 && (
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
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {app.appName}
                  </TableCell>
                  <TableCell align="right">
                    {app.defaultAccessAssetsOpen.toString()}
                  </TableCell>
                  <TableCell align="right">
                    {app.defaultAccessProfileOpen.toString()}
                  </TableCell>
                  <TableCell align="right">{app.usersCanFree.toString()}</TableCell>
                  <TableCell align="right">
                    {new Date(app.createdAt).toDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Box style={{display: 'flex', flexDirection: 'column'}}>
                      <a href="/" onClick={(e) => {
                        e.preventDefault()
                        onDelete(app)
                      }}>Delete</a>
                      <a 
                        href={`data:text/json;chatset=utf-8,${encodeURIComponent(
                          JSON.stringify({appJwt: app.appToken})
                        )}`}
                        style={{display: 'none'}}
                        download = "data.json"
                        id={`app-jwt-${app._id}`}
                      >download jwt</a>
                      <a href="/" onClick={(e) => {
                        e.preventDefault()
                        const el = document.querySelector(`#app-jwt-${app._id}`) as HTMLElement
                        el?.click()
                      }}>
                        Download App JWT
                      </a>
                      <a href="/" onClick={(e) => {
                        e.preventDefault()
                      }}>Rotate App Jwt</a>
                      <a href="/" onClick={(e) => {
                        e.preventDefault()
                        onEdit(app)
                      }}>Edit</a>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      }
      <NewAppModal open={open} setOpen={setOpen}></NewAppModal>
      <DeleteAppModal app={currentApp} open={showDelete} setOpen={setShowDelete}/>
      {showEdit && <EditAppModal app={currentApp} open={showEdit} setOpen={setShowEdit}></EditAppModal>}
    </TableContainer>
  );
}
