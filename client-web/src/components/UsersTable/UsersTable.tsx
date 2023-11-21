import React, { useEffect, useRef, useState } from "react"

import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from "@mui/material"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import CloseIcon from "@mui/icons-material/Close"
import { UsersTableToolbar } from "./Toolbar"
import { UsersTableHead } from "./Head"
import { UsersActionModal } from "../UsersActionModal"
import { IOtherUserACL, IUser, exportUsersCsv, getAppUsers } from "../../http"
import { TApp, useStoreState } from "../../store"
import NewUserModal from "../../pages/Owner/NewUserModal"
import { EditAcl } from "../EditAcl"
import NoDataImage from "../NoDataImage"
import { UsersTableRow } from "./UsersTableRow"
import { useSnackbar } from "../../context/SnackbarContext"
import { format } from "date-fns"

type Order = "asc" | "desc"

export type ModalType =
  | "deleteUser"
  | "sendTokens"
  | "manageTags"
  | "resetPassword"

interface Properties {
  currentApp: string
  onAppChange: (app: string) => void
}

export type TSelectedIds = {
  walletAddress: string
  _id: string
  appId: string
  tags: string[]
}
export default function UsersTable({ currentApp, onAppChange }: Properties) {
  const [order, setOrder] = useState<Order>("desc")
  const [orderBy, setOrderBy] = useState<keyof IUser>("createdAt")
  const [selectedIds, setSelectedIds] = useState<TSelectedIds[]>([])
  const [page, setPage] = useState(0)
  const [userActionModal, setUsersActionModal] = useState<{
    open: boolean
    type: ModalType
  }>({ open: false, type: "manageTags" })
  const apps = useStoreState((state) => state.apps)

  const [showNewUser, setShowNewUser] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [users, setUsers] = useState<IUser[]>([])
  const [aclEditData, setAclEditData] = useState<{
    modalOpen: boolean
    user: IUser | null
  }>({
    modalOpen: false,
    user: null,
  })
  const ownerAccess = useStoreState((state) => state.user.ACL?.ownerAccess)
  const ACL = useStoreState((state) =>
    state.ACL.result.find((index) => index.appId === currentApp)
  )
  const canCreateUsers = ownerAccess || ACL?.application.appUsers.create
  const { showSnackbar } = useSnackbar()
  const [pagination, setPagination] = useState<{
    total: number
    limit: number
    offset: number
  }>()

  const getUsers = async (
    appId: string | null,
    limit: number = rowsPerPage,
    offset: number = 0,
    orderBy?: string,
    order?: string
  ) => {
    try {
      if (appId) {
        const { data } = await getAppUsers(appId, limit, offset, orderBy, order)
        setPagination({
          limit: data.limit,
          offset: data.offset,
          total: data.total,
        })
        return data.items
      }
    } catch (error) {
      console.log(error)
    }
    return []
  }

  const getInitialUsers = async (appId: string) => {
    const allUsers = await getUsers(
      appId,
      rowsPerPage,
      users.length,
      orderBy,
      order
    )
    setUsers(allUsers)
    if (selectedIds.length > 0) {
      const updatedIds = selectedIds.map((u) => {
        const updatedUser = allUsers.find((index) => index._id === u._id)
        return {
          _id: updatedUser._id,
          walletAddress: updatedUser.defaultWallet.walletAddress,
          appId: updatedUser.appId,
          tags: updatedUser.tags,
        }
      })
      setSelectedIds(updatedIds)
    }
  }

  useEffect(() => {
    if (currentApp) {
      getInitialUsers(currentApp)
    }
  }, [currentApp, onAppChange])

  const onAppSelectChange = (e: SelectChangeEvent) => {
    onAppChange(e.target.value)
    getInitialUsers(e.target.value)
  }

  const onPagination = async (
    event: React.ChangeEvent<unknown>,
    tablePage: number
  ) => {
    const limit = rowsPerPage
    const offset = tablePage * limit
    const fetchedUsers = await getUsers(
      currentApp,
      limit,
      offset,
      orderBy,
      order
    )
    setPage(tablePage)
    setSelectedIds([])
    setUsers(fetchedUsers)
  }

  const handleChangeRowsPerPage = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = Number.parseInt(event.target.value, 10)
    const users = await getUsers(currentApp, value, 0, orderBy, order)
    setRowsPerPage(value)
    setUsers(users)
    setPage(0)
    setSelectedIds([])
  }

  const handleAclEditClose = () =>
    setAclEditData({ modalOpen: false, user: null })

  const updateUserDataAfterAclChange = (user: IOtherUserACL) => {
    const oldUsers = users
    const indexToUpdate = oldUsers.findIndex(
      (item) => item._id === aclEditData.user._id
    )
    if (indexToUpdate !== -1) {
    }
    oldUsers[indexToUpdate].acl = user.result
    setUsers(oldUsers)
  }

  const handleRequestSort = async (
    event: React.MouseEvent<unknown>,
    property: keyof IUser
  ) => {
    const isAsc = orderBy === property && order === "asc"
    const currentOrder = isAsc ? "desc" : "asc"
    const limit = rowsPerPage
    const users = await getUsers(currentApp, limit, 0, property, currentOrder)
    setOrder(currentOrder)
    setOrderBy(property)
    setUsers(users)
    setSelectedIds([])
  }
  const openActionModal = (type: ModalType) => {
    setUsersActionModal({ open: true, type })
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected: TSelectedIds[] = users.map((n) => ({
        _id: n._id,
        walletAddress: n.defaultWallet.walletAddress,
        appId: n.appId,
        tags: n.tags,
      }))
      setSelectedIds(newSelected)
      return
    }
    setSelectedIds([])
  }

  const handleClick = (event: React.MouseEvent<unknown>, user: IUser) => {
    const selectedIndex = selectedIds.findIndex((item) => item._id === user._id)
    const mappedUser: TSelectedIds = {
      _id: user._id,
      walletAddress: user.defaultWallet.walletAddress,
      appId: user.appId,
      tags: user.tags,
    }
    let newSelected: TSelectedIds[] = []

    switch (selectedIndex) {
      case -1: {
        newSelected = newSelected.concat(selectedIds, mappedUser)

        break
      }
      case 0: {
        newSelected = newSelected.concat(selectedIds.slice(1))

        break
      }
      case selectedIds.length - 1: {
        newSelected = newSelected.concat(selectedIds.slice(0, -1))

        break
      }
      default: {
        if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            selectedIds.slice(0, selectedIndex),
            selectedIds.slice(selectedIndex + 1)
          )
        }
      }
    }

    setSelectedIds(newSelected)
  }

  const onExportClick = async () => {
    try {
      const res = await exportUsersCsv(currentApp)
      const url = `data:text/csv;charset=UTF-8,${encodeURIComponent(res.data)}`
      const a = document.createElement("a")
      const fileName = "users-" + format(new Date(), "yyyy-MM-dd") + ".csv"
      a.href = url
      a.download = fileName
      document.body.append(a)
      a.click()
      a.remove()
      window.open(url, "_blank")
    } catch (error) {
      showSnackbar("error", "Cannot get content")
      console.log(error)
    }
  }

  const closeUsersActionModal = async () => {
    setUsersActionModal((p) => ({ ...p, open: false }))
  }
  const updateUsersData = async () => {
    await getInitialUsers(currentApp)
  }

  const updateAclEditData = (user: IUser) => {
    setAclEditData({ modalOpen: true, user })
  }

  const isSelected = (id: string) =>
    selectedIds.findIndex((u) => u._id === id) !== -1

  if (users.length === 0) {
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
          {apps.length > 0 && (
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
                      {app.displayName}
                    </MenuItem>
                  )
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
    )
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
          {apps.length > 0 && (
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
                      {app.displayName}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          )}
          {canCreateUsers && (
            <Box sx={{ marginLeft: "auto" }}>
              <Button variant={"outlined"} onClick={onExportClick}>
                Export CSV
              </Button>
              <IconButton onClick={() => setShowNewUser(true)} size="large">
                <AddCircleIcon fontSize="large" color="primary" />
              </IconButton>
            </Box>
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
              {users.map((row) => {
                return (
                  <UsersTableRow
                    key={row._id}
                    data={row}
                    isSelected={isSelected}
                    onRowClick={handleClick}
                    updateAclEditData={updateAclEditData}
                  />
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={pagination.total}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          page={page}
          onPageChange={onPagination}
          rowsPerPageOptions={[10, 25, 50]}
          labelRowsPerPage={"Users per page"}
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
            position: "absolute" as const,
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
  )
}
