import React, { useEffect, useRef, useState } from "react";

import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { UsersTableToolbar } from "./Toolbar";
import { UsersTableHead } from "./Head";
import { UsersActionModal } from "../UsersActionModal";
import { ACL, IOtherUserACL, IUser, IUserAcl, getAppUsers } from "../../http";
import { useStoreState } from "../../store";
import NewUserModal from "../../pages/Owner/NewUserModal";
import { EditAcl } from "../EditAcl";
import NoDataImage from "../NoDataImage";
import { dateToHumanReadableFormat } from "../../utils";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string | any },
  b: { [key in Key]: number | string | any }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

type ModalType =
  | "deleteUser"
  | "addTag"
  | "removeTag"
  | "removeAllTags"
  | "sendTokens"
  | "resetPassword";

interface Props {}
function hasACLAdmin(acl: ACL): boolean {
  const application = acl?.application;
  if (application) {
    const appKeys = Object.keys(application);
    let hasAdmin = false;
    for (let i = 0; i < appKeys.length; i++) {
      if (application[appKeys[i]]?.admin === true) {
        hasAdmin = true;
        break;
      }
    }
    return hasAdmin;
  }
  return false;
}

const ITEM_HEIGHT = 48;
const ROWS_PER_PAGE = 10;
export type TSelectedIds = {
  walletAddress: string;
  _id: string;
  appId: string;
  tags: string[];
};
export default function UsersTable() {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof IUser>("appId");
  const [selectedIds, setSelectedIds] = useState<TSelectedIds[]>([]);
  const [page, setPage] = useState(0);
  const [userActionModal, setUsersActionModal] = useState<{
    open: boolean;
    type: ModalType;
  }>({ open: false, type: "addTag" });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const apps = useStoreState((state) => state.apps);
  const ownerAccess = useStoreState((state) => state.user.ACL?.ownerAccess);
  const [showNewUser, setShowNewUser] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentApp, setCurrentApp] = useState<string>(apps[0]?._id);
  const [aclEditData, setAclEditData] = useState<{
    modalOpen: boolean;
    user: IUser | null;
  }>({
    modalOpen: false,
    user: null,
  });
  const [hasAdmin, setHasAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const maxPage = useRef(0);

  const ACL = useStoreState((state) =>
    state.ACL.result.find((i) => i.appId === currentApp)
  );
  const canCreateUsers = ownerAccess || ACL?.application.appUsers.create;

  useEffect(() => {
    setHasAdmin(hasACLAdmin(ACL));
  }, [ACL]);

  const [pagination, setPagination] = useState<{
    total: number;
    limit: number;
    offset: number;
  }>();

  const getUsers = async (
    appId: string | null,
    limit: number = ROWS_PER_PAGE,
    offset: number = 0
  ) => {
    try {
      if (appId) {
        const getUsersResp = await getAppUsers(appId, limit, offset);
        const { data } = getUsersResp;
        setPagination({
          limit: data.limit,
          offset: data.offset,
          total: data.total,
        });
        return data.items;
      }
    } catch (e) {
      console.log(e);
    }
    return [];
  };

  const getInitialUsers = async (appId: string) => {
    const allUsers = await getUsers(appId);
    setUsers(allUsers);
    if (selectedIds.length) {
      const updatedIds = selectedIds.map((u) => {
        const updatedUser = allUsers.find((i) => i._id === u._id);
        return {
          _id: updatedUser._id,
          walletAddress: updatedUser.defaultWallet.walletAddress,
          appId: updatedUser.appId,
          tags: updatedUser.tags,
        };
      });
      setSelectedIds(updatedIds);
    }
  };

  useEffect(() => {
    if (currentApp) {
      getInitialUsers(currentApp);
    }
  }, [currentApp]);

  const onAppSelectChange = (e: SelectChangeEvent) => {
    setCurrentApp(e.target.value);
    getInitialUsers(e.target.value);
  };

  const onPagination = (
    event: React.ChangeEvent<unknown>,
    tablePage: number
  ) => {
    const limit = ROWS_PER_PAGE;
    const offset = tablePage * limit;
    setPage(tablePage);
    if (maxPage.current < tablePage) {
      maxPage.current = tablePage;
      getUsers(currentApp, limit, offset).then((u) => {
        setUsers((p) => [...users, ...u]);
      });
    }
  };

  const handleAclEditOpen = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    user: IUser
  ) => {
    e.stopPropagation();
    setAclEditData({ modalOpen: true, user });
    handleMenuClose();
  };

  const handleAclEditClose = () =>
    setAclEditData({ modalOpen: false, user: null });

  const updateUserDataAfterAclChange = (user: IOtherUserACL) => {
    const oldUsers = users;
    const indexToUpdate = oldUsers.findIndex(
      (item) => item._id === aclEditData.user._id
    );
    if (indexToUpdate !== -1) {
    }
    oldUsers[indexToUpdate].acl = user.result;
    setUsers(oldUsers);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof IUser
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const openActionModal = (type: ModalType) => {
    setUsersActionModal({ open: true, type });
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected: TSelectedIds[] = users.map((n) => ({
        _id: n._id,
        walletAddress: n.defaultWallet.walletAddress,
        appId: n.appId,
        tags: n.tags,
      }));
      setSelectedIds(newSelected);
      return;
    }
    setSelectedIds([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, user: IUser) => {
    const selectedIndex = selectedIds.findIndex(
      (item) => item._id === user._id
    );
    const mappedUser: TSelectedIds = {
      _id: user._id,
      walletAddress: user.defaultWallet.walletAddress,
      appId: user.appId,
      tags: user.tags,
    };
    let newSelected: TSelectedIds[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, mappedUser);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1)
      );
    }

    setSelectedIds(newSelected);
  };

  const closeUsersActionModal = async () => {
    setUsersActionModal((p) => ({ ...p, open: false }));
  };
  const updateUsersData = async () => {
    await getInitialUsers(currentApp);
  };

  const isSelected = (id: string) =>
    selectedIds.findIndex((u) => u._id === id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * ROWS_PER_PAGE - users.length) : 0;
  if (!users.length) {
    return (
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" style={{ margin: "16px" }}>
            Users
          </Typography>
          {!!apps.length && (
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
          )}
          {canCreateUsers && (
            <IconButton
              onClick={() => setShowNewUser(true)}
              size="large"
              sx={{ marginLeft: "auto" }}
            >
              <AddCircleIcon fontSize="large" color="primary" />
            </IconButton>
          )}
        </Box>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <NoDataImage />
          <Typography style={{ marginTop: "20px", marginBottom: "20px" }}>
            Users not found.
          </Typography>
        </Box>
        <NewUserModal
          open={showNewUser}
          setUsers={setUsers}
          setOpen={setShowNewUser}
          appId={currentApp}
        />
      </Paper>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" style={{ margin: "16px" }}>
            Users
          </Typography>
          {!!apps.length && (
            <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="select-label">App</InputLabel>
              <Select
                labelId="select-label"
                id="select-label"
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
          )}
          {canCreateUsers && (
            <IconButton
              onClick={() => setShowNewUser(true)}
              size="large"
              sx={{ marginLeft: "auto" }}
            >
              <AddCircleIcon fontSize="large" color="primary" />
            </IconButton>
          )}
        </Box>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <UsersTableHead
              numSelected={selectedIds.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={users.length}
            />
            <TableBody>
              {stableSort(users, getComparator(order, orderBy))
                .slice(
                  page * ROWS_PER_PAGE,
                  page * ROWS_PER_PAGE + ROWS_PER_PAGE
                )
                .map((row, index) => {
                  const isItemSelected = isSelected(row._id.toString());
                  const labelId = `Users-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.appId}
                      </TableCell>
                      <TableCell align="right">{row.firstName}</TableCell>
                      <TableCell align="right">{row.lastName}</TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            justifyContent: "center",
                          }}
                        >
                          {row.tags.map((tag, i) => {
                            return (
                              <Chip
                                variant={"filled"}
                                color="primary"
                                label={tag}
                                key={i}
                              />
                            );
                          })}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {row.email || "No Email"}
                      </TableCell>
                      <TableCell align="center">
                        <p style={{ width: 150 }}>
                          {dateToHumanReadableFormat(row.createdAt)}
                        </p>
                        <p>
                          {row.lastSeen
                            ? dateToHumanReadableFormat(row.lastSeen)
                            : ""}
                        </p>
                      </TableCell>
                      <TableCell align="center">
                        {row.authMethod || ""}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          disabled={!hasAdmin}
                          aria-label="more"
                          id="long-button"
                          aria-controls={open ? "long-menu" : undefined}
                          aria-expanded={open ? "true" : undefined}
                          aria-haspopup="true"
                          onClick={handleMenuClick}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          id="long-menu"
                          MenuListProps={{
                            "aria-labelledby": "long-button",
                          }}
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleMenuClose}
                          PaperProps={{
                            style: {
                              maxHeight: ITEM_HEIGHT * 4.5,
                              width: "20ch",
                              boxShadow: "5px 5px 10px 0px rgba(0,0,0,0.05)",
                            },
                          }}
                        >
                          <MenuItem onClick={(e) => handleAclEditOpen(e, row)}>
                            Edit Acl
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={pagination.total}
          rowsPerPage={ROWS_PER_PAGE}
          page={page}
          onPageChange={onPagination}
          rowsPerPageOptions={[]}
        />
        <UsersTableToolbar
          onButtonClick={openActionModal}
          selected={selectedIds}
        />
      </Paper>

      <UsersActionModal
        type={userActionModal.type}
        open={userActionModal.open}
        onClose={closeUsersActionModal}
        selectedUsers={selectedIds}
        updateData={updateUsersData}
      />
      <NewUserModal
        open={showNewUser}
        setUsers={setUsers}
        setOpen={setShowNewUser}
        appId={currentApp}
      />
      <Modal
        open={aclEditData.modalOpen}
        onClose={handleAclEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "70vw",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "10px",
            p: 4,
          }}
        >
          <EditAcl
            updateData={updateUserDataAfterAclChange}
            onAclError={handleAclEditClose}
            user={aclEditData.user}
          />
          <IconButton
            onClick={handleAclEditClose}
            sx={{ position: "absolute", top: 0, right: 0, color: "black" }}
          >
            <CloseIcon fontSize={"large"} />
          </IconButton>
        </Box>
      </Modal>
    </Box>
  );
}
