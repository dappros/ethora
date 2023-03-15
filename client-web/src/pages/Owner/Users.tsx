import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { IconButton, Modal, Typography } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useStoreState } from "../../store";
import NoDataImage from "../../components/NoDataImage";
import NewUserModal from "./NewUserModal";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Pagination from "@mui/material/Pagination";
import CloseIcon from "@mui/icons-material/Close";
import * as http from "../../http";
import { EditAcl } from "../../components/EditAcl";

const boxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70vw",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
};

function hasACLAdmin(acl: http.IUserAcl): boolean {
  const appKeys = Object.keys(acl.result.application);
  let hasAdmin = false;
  for (let i = 0; i < appKeys.length; i++) {
    if (acl.result.application[appKeys[i]].admin === true) {
      hasAdmin = true;
      break;
    }
  }

  return hasAdmin;
}

export default function UsersTable() {
  const apps = useStoreState((state) => state.apps);
  const ownerAccess = useStoreState((state) => state.user.ACL?.ownerAccess);
  const user = useStoreState((state) => state.user);
  const [showNewUser, setShowNewUser] = React.useState(false);
  const [users, setUsers] = React.useState<[] | http.IUser[]>([]);
  const [currentApp, setCurrentApp] = React.useState<string>();
  const [aclEditData, setAclEditData] = React.useState({
    modalOpen: false,
    userId: "",
  });
  const [hasAdmin, setHasAdmin] = React.useState(false);
  const ACL = useStoreState((state) => state.ACL);

  React.useEffect(() => {
    setHasAdmin(hasACLAdmin(ACL));
  }, [ACL]);

  const [pagination, setPagination] = React.useState<{
    total: number;
    limit: number;
    offset: number;
  }>();

  const getUsers = async (
    appId: string | null,
    limit: number = 10,
    offset: number = 0
  ) => {
    try {
      if (appId) {
        console.log(appId);
        const getUsersResp = await http.getAppUsers(appId, limit, offset);
        const { data } = getUsersResp;
        setPagination({
          limit: data.limit,
          offset: data.offset,
          total: data.total,
        });
        return data.items;
      }
    } catch (e) {}
    return [];
  };

  React.useEffect(() => {
    if (ownerAccess) {
      if (apps.length) {
        setCurrentApp(apps[0]._id);
        getUsers(apps[0]._id).then((users) => {
          setUsers(users);
        });
      }
    }
  }, [apps]);

  React.useEffect(() => {
    if (!ownerAccess) {
      setCurrentApp(user.appId);
      getUsers(user.appId).then((users) => {
        setUsers(users);
      });
    }
  }, []);

  React.useEffect(() => {
    console.log("Users mount");
  }, []);

  const onAppSelectChange = (e: SelectChangeEvent) => {
    setCurrentApp(e.target.value);
    getUsers(e.target.value).then((users) => {
      setUsers(users);
    });
  };

  const onPagination = (event: React.ChangeEvent<unknown>, page: number) => {
    // page = 1 => offset 0
    // page = 2 => offset 10
    // page = 3 => offset 20
    let offset = 0;
    if (page - 1 > 0) {
      offset = (page - 1) * (pagination?.limit || 10);
    }

    getUsers(currentApp || null, pagination?.limit || 10, offset).then(
      (users) => setUsers(users)
    );
  };

  const handleAclEditOpen = (userId: string) =>
    setAclEditData({ modalOpen: true, userId: userId });

  const handleAclEditClose = () =>
    setAclEditData({ modalOpen: false, userId: "" });

  const updateUserDataAfterAclChange = (user: http.IUserAcl) => {
    const oldUsers = users;
    const indexToUpdate = oldUsers.findIndex(
      (item) => item._id === aclEditData.userId
    );
    if (indexToUpdate !== -1) {
    }
    oldUsers[indexToUpdate]._id = user.result.userId;
    setUsers(oldUsers);
  };

  return (
    <TableContainer component={Paper} style={{ margin: "0 auto" }}>
      <Box style={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h6" style={{ margin: "16px" }}>
          Users
        </Typography>
        {currentApp && ownerAccess ? (
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">App</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="App"
              value={currentApp}
              onChange={onAppSelectChange}
            >
              {apps.map((app) => {
                return (
                  <MenuItem key={app._id} value={app._id}>
                    {app.appName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        ) : null}

        {(ownerAccess || ACL.result.application.appUsers.create) && (
          <IconButton onClick={() => setShowNewUser(true)} size="large">
            <AddCircleIcon fontSize="large"></AddCircleIcon>
          </IconButton>
        )}
      </Box>
      {users.length === 0 && (
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <NoDataImage></NoDataImage>
          <Typography style={{ marginTop: "20px", marginBottom: "20px" }}>
            Users not found.
          </Typography>
        </Box>
      )}

      {users.length > 0 && (
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell width={200}>appId</TableCell>
              <TableCell align="right">firstName</TableCell>
              <TableCell align="right">lastName</TableCell>
              <TableCell align="right">username</TableCell>
              <TableCell align="right">email</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.appId}
                </TableCell>
                <TableCell align="right">{user.firstName}</TableCell>
                <TableCell align="right">{user.lastName}</TableCell>
                <TableCell align="right">
                  {user.username ? user.username : "-"}
                </TableCell>
                <TableCell align="right">
                  {user.email ? user.email : "-"}
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ width: "200px" }}>
                    {ACL.result.application.appUsers.update && (
                      <Typography>Edit</Typography>
                    )}

                    {hasAdmin && (
                      <Typography
                        style={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() => handleAclEditOpen(user._id)}
                      >
                        Edit ACL
                      </Typography>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {pagination?.total && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Pagination
                    onChange={onPagination}
                    count={Math.ceil(pagination.total / pagination.limit)}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      <NewUserModal
        open={showNewUser}
        setUsers={setUsers}
        setOpen={setShowNewUser}
      />
      <Modal
        open={aclEditData.modalOpen}
        onClose={handleAclEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={boxStyle}>
          <EditAcl
            updateData={updateUserDataAfterAclChange}
            userId={aclEditData.userId}
          />
          <IconButton
            onClick={handleAclEditClose}
            sx={{ position: "absolute", top: 0, right: 0, color: "black" }}
          >
            <CloseIcon fontSize={"large"} />
          </IconButton>
        </Box>
      </Modal>
    </TableContainer>
  );
}
