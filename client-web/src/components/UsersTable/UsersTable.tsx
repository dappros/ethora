import React, { useEffect, useState } from "react";

import {
  Box,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Paper,
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
import { IUser, IUserAcl, getAppUsers } from "../../http";
import { useStoreState } from "../../store";
import NewUserModal from "../../pages/Owner/NewUserModal";
import { EditAcl } from "../EditAcl";
import NoDataImage from "../NoDataImage";

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
function hasACLAdmin(acl: IUserAcl): boolean {
  const application = acl.result?.application;
  if (application) {
    const appKeys = Object.keys(acl.result?.application);
    let hasAdmin = false;
    for (let i = 0; i < appKeys.length; i++) {
      if (acl.result?.application[appKeys[i]]?.admin === true) {
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


export default function UsersTable() {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof IUser>("appId");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
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
  const [currentApp, setCurrentApp] = useState<string>();
  const [aclEditData, setAclEditData] = useState({
    modalOpen: false,
    userId: "",
  });
  const [hasAdmin, setHasAdmin] = useState(false);
  const ACL = useStoreState((state) => state.ACL);

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
    limit: number = 10,
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

  useEffect(() => {
    if (apps.length && apps[0]) {
      setCurrentApp(apps[0]._id);
      getUsers(apps[0]._id).then((users) => {
        setUsers(users);
      });
    }
  }, [apps]);


 

  const onAppSelectChange = (e: SelectChangeEvent) => {
    setCurrentApp(e.target.value);
    getUsers(e.target.value).then((users) => {
      setUsers(users);
    });
  };

  const onPagination = (event: React.ChangeEvent<unknown>, page: number) => {
    let offset = 0;
    setPage(page);
    if (page - 1 > 0) {
      offset = (page - 1) * (pagination?.limit || 10);
    }

    getUsers(currentApp || null, pagination?.limit || 10, offset).then(
      (users) => setUsers(users)
    );
  };

  const handleAclEditOpen = (userId: string) => {
    setAclEditData({ modalOpen: true, userId: userId });
    handleMenuClose();
  };

  const handleAclEditClose = () =>
    setAclEditData({ modalOpen: false, userId: "" });

  const updateUserDataAfterAclChange = (user: IUserAcl) => {
    const oldUsers = users;
    const indexToUpdate = oldUsers.findIndex(
      (item) => item._id === aclEditData.userId
    );
    if (indexToUpdate !== -1) {
    }
    oldUsers[indexToUpdate]._id = user.result.userId;
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
      const newSelected = users.map((n) => n._id);
      setSelectedIds(newSelected);
      return;
    }
    setSelectedIds([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, id);
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

  console.log(selectedIds);

  const isSelected = (name: string) => selectedIds.indexOf(name) !== -1;

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
          {(ownerAccess || ACL.result?.application.appUsers.create) && (
            <IconButton onClick={() => setShowNewUser(true)} size="large">
              <AddCircleIcon fontSize="large" />
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
          {(ownerAccess || ACL.result?.application.appUsers.create) && (
            <IconButton onClick={() => setShowNewUser(true)} size="large">
              <AddCircleIcon fontSize="large" />
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
                      onClick={(event) =>
                        handleClick(event, row._id.toString())
                      }
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
                      <TableCell align="right">{row.username}</TableCell>
                      <TableCell align="right">
                        {row.email || "No Email"}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
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
                            },
                          }}
                        >
                          {hasAdmin && (
                            <MenuItem
                              onClick={() => handleAclEditOpen(row._id)}
                            >
                              Edit Acl
                            </MenuItem>
                          )}
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
          count={users.length}
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
        onClose={() => setUsersActionModal((p) => ({ ...p, open: false }))}
        userIds={selectedIds}
      />
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
            userId={aclEditData.userId}
            onAclError={handleAclEditClose}
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
