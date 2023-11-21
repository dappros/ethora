import React, {
  ChangeEvent,
  useEffect,
  useState,
  useCallback,
  lazy,
  Dispatch,
  SetStateAction,
} from "react"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import { IconButton, TablePagination, Tooltip, Typography } from "@mui/material"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import { useStoreState } from "../../store"
import NoDataImage from "../../components/NoDataImage"
import EditAppModal from "./EditAppModal"
import RotateModal from "./RotateModal"
import { RegisterCompanyModal } from "../../components/RegisterCompanyModal"
import { coinsMainName } from "../../config/config"
import { getApps } from "../../http"
import { useSnackbar } from "../../context/SnackbarContext"
import { useHistory } from "react-router"
import SettingsIcon from "@mui/icons-material/Settings"
import { AppsTableHead, CellId } from "../../components/AppsTable/AppsTableHead"
import LeaderboardIcon from "@mui/icons-material/Leaderboard"
import { Loader } from "../../components/AppsTable/Loader"

const NewAppModal = lazy(() => import("./NewAppModal"))
const DeleteAppModal = lazy(() => import("./DeletAppModal"))

interface Props {
  onRowClick?: (app: string) => void
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
  setCurrentAppName: (name: string) => void
}

const NA = "N/A"
const COINS_TO_CREATE_APP = 10

function Apps({
  onRowClick,
  isLoading,
  setIsLoading,
  setCurrentAppName,
}: Props) {
  const { setApps, apps, user, ACL, balance } = useStoreState((state) => ({
    setApps: state.setApps,
    apps: state.apps,
    user: state.user,
    ACL: state.ACL,
    balance: state.balance,
  }))

  const [currentPageApps, setCurrentPageApps] = useState(apps)
  const history = useHistory()
  const [open, setOpen] = useState(false)
  const [companyModalOpen, setCompanyModalOpen] = useState(false)
  const mainCoinBalance = balance.find((el) => el.tokenName === coinsMainName)
  const isEnoughCoinsToCreateApp =
    +mainCoinBalance?.balance >= COINS_TO_CREATE_APP
  const currentAcl = ACL.result.find((item) => item.appId === user.appId)
  const canCreateApp = currentAcl?.application?.appCreate?.create

  const [pagination, setPagination] = useState<{
    total: number
    limit: number
    offset: number
  }>()

  const [showDelete, setShowDelete] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [page, setPage] = useState(0)
  const [showRotate, setShowRotate] = useState(false)
  const [currentApp, setCurrentApp] = useState({
    _id: "",
    appName: "",
    appDescription: "",
    appGoogleId: "",
    defaultAccessProfileOpen: false,
    defaultAccessAssetsOpen: false,
    usersCanFree: false,
  })

  const [order, setOrder] = useState<"asc" | "desc">("asc")
  const [orderBy, setOrderBy] = useState<CellId>("displayName")

  const handleRequestSort = (property: CellId) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)

    const comparator = (a, b) => {
      let valueA, valueB, statsSumA, statsSumB
      switch (property) {
        case "users":
          statsSumA = a.stats.totalRegistered
          statsSumB = b.stats.totalRegistered
          valueA = isNaN(+statsSumA) ? statsSumA : +statsSumA
          valueB = isNaN(+statsSumB) ? statsSumB : +statsSumB
          break
        case "sessions":
          statsSumA = a.stats.totalSessions
          statsSumB = b.stats.totalSessions
          valueA = isNaN(+statsSumA) ? statsSumA : +statsSumA
          valueB = isNaN(+statsSumB) ? statsSumB : +statsSumB
          break
        case "api":
          statsSumA = a.stats.totalApiCalls
          statsSumB = b.stats.totalApiCalls
          valueA = isNaN(+statsSumA) ? statsSumA : +statsSumA
          valueB = isNaN(+statsSumB) ? statsSumB : +statsSumB
          break
        case "files":
          statsSumA = a.stats.totalFiles
          statsSumB = b.stats.totalFiles
          valueA = isNaN(+statsSumA) ? statsSumA : +statsSumA
          valueB = isNaN(+statsSumB) ? statsSumB : +statsSumB
          break
        case "web3":
          statsSumA = a.stats.totalTransactions
          statsSumB = b.stats.totalTransactions
          valueA = isNaN(+statsSumA) ? statsSumA : +statsSumA
          valueB = isNaN(+statsSumB) ? statsSumB : +statsSumB
          break
        default:
          valueA = isNaN(+a[property]) ? a[property] : +a[property]
          valueB = isNaN(+b[property]) ? b[property] : +b[property]
          break
      }

      if (valueA < valueB) {
        return isAsc ? -1 : 1
      }
      if (valueA > valueB) {
        return isAsc ? 1 : -1
      }
      return 0
    }

    const sortedApps = [...currentPageApps].sort(comparator)
    setCurrentPageApps(sortedApps)
  }

  const { showSnackbar } = useSnackbar()

  useEffect(() => {
    getUserApps()
  }, [])

  useEffect(() => {
    if (currentPageApps.length > 0) {
      setCurrentAppName(apps[0]._id)
    }
  }, [currentPageApps])

  const getUserApps = async (offset: number = 0) => {
    setIsLoading(true)
    try {
      const apps = await getApps(offset)
      const notNullApps = apps.data.apps.filter((a) => !!a)
      setCurrentPageApps(notNullApps)
      setApps(notNullApps)
      setPagination({
        limit: apps.data.limit,
        offset: apps.data.offset,
        total: apps.data.total,
      })
      setIsLoading(false)
    } catch (error) {
      setPage((page) => page - 1)
      showSnackbar("error", "Cannot get user apps")
      setIsLoading(false)
    }
  }

  const onDelete = (app: any) => {
    setCurrentApp(app)
    setShowDelete(true)
  }

  const onPagination = useCallback(
    async (event: ChangeEvent<unknown>, tablePage: number) => {
      const offset = tablePage * 10
      setPage(tablePage)
      await getUserApps(offset)
    },
    [pagination, getUserApps, currentPageApps]
  )

  const onEdit = (app: any) => {
    setCurrentApp(app)
    history.push("/editApp/" + app._id)
    setShowEdit(true)
  }

  const onRotateJwt = (app: any) => {
    setCurrentApp(app)
    setShowRotate(true)
  }
  const onAddApp = () => {
    if (!user.isAgreeWithTerms) {
      setCompanyModalOpen(true)
      return
    }
    setOpen(true)
  }
  //  useEffect(() => {
  //     if(user.homeScreen === 'appCreate') {
  //       onAddApp()
  //     }
  //   }, [user.homeScreen])
  return (
    <TableContainer component={Paper} style={{ margin: "0 auto" }}>
      <Box style={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h6" style={{ margin: "16px" }}>
          Apps
        </Typography>
        <Tooltip
          title={
            isEnoughCoinsToCreateApp
              ? canCreateApp
                ? ""
                : "You don't have permission to create app"
              : "You don't have enough coins to create the app."
          }
        >
          <span style={{ marginLeft: "auto" }}>
            <IconButton
              id="addApp"
              disabled={!isEnoughCoinsToCreateApp || !canCreateApp}
              onClick={onAddApp}
              size="large"
              color="primary"
            >
              <AddCircleIcon fontSize="large"></AddCircleIcon>
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      {apps.length === 0 && (
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <NoDataImage></NoDataImage>
          <Typography style={{ marginTop: "20px", marginBottom: "20px" }}>
            You have not created any apps.
          </Typography>
        </Box>
      )}
      {apps.length > 0 && (
        <Table
          sx={{
            minWidth: 650,
          }}
          aria-label="simple table"
        >
          <AppsTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            isLoading={isLoading}
          />
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} style={{ textAlign: "center" }}>
                  <Loader styles={{ width: "100%" }} />
                </TableCell>
              </TableRow>
            ) : (
              currentPageApps.map((app) => (
                <TableRow
                  key={app._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    onClick={() => onRowClick(app._id)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {app.displayName}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    {app.stats?.totalRegistered.toLocaleString("en-US")}
                    <span style={{ fontWeight: "bold", color: "green" }}>
                      +{app.stats?.recentlyRegistered}
                    </span>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    {app.stats?.totalSessions.toLocaleString("en-US")}
                    <span style={{ fontWeight: "bold", color: "green" }}>
                      +{app.stats?.recentlySessions}
                    </span>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    {NA}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    {app.stats?.totalApiCalls.toLocaleString("en-US")}
                    <span style={{ fontWeight: "bold", color: "green" }}>
                      +{app.stats?.recentlyApiCalls}
                    </span>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    {app.stats?.totalFiles.toLocaleString("en-US")}
                    <span style={{ fontWeight: "bold", color: "green" }}>
                      +{app.stats?.recentlyFiles}
                    </span>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    {app.stats?.totalTransactions.toLocaleString("en-US")}
                    <span style={{ fontWeight: "bold", color: "green" }}>
                      +{app.stats?.recentlyTransactions}
                    </span>
                  </TableCell>

                  <TableCell align="center">
                    {new Date(app.createdAt).toDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <IconButton onClick={() => onEdit(app)} id="settings">
                        <SettingsIcon color="primary" />
                      </IconButton>
                      <IconButton
                        onClick={() => history.push("/statistics/" + app._id)}
                        id="statistics"
                      >
                        <LeaderboardIcon color="primary" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
            <TablePagination
              count={pagination?.total || 10}
              rowsPerPage={10}
              page={page}
              onPageChange={onPagination}
              showFirstButton={!isLoading}
              showLastButton={!isLoading}
              labelRowsPerPage=""
              sx={{
                "& .MuiSelect-select": {
                  display: "none !important",
                },
                "& > div.MuiToolbar-root > div.MuiInputBase-root > svg": {
                  display: "none !important",
                },
                "& .MuiTablePagination-displayedRows": {
                  display: "none !important",
                },
              }}
              SelectProps={{
                disabled: isLoading,
              }}
              backIconButtonProps={
                isLoading
                  ? {
                      disabled: isLoading,
                    }
                  : undefined
              }
              nextIconButtonProps={
                isLoading
                  ? {
                      disabled: isLoading,
                    }
                  : undefined
              }
            />
          </TableBody>
        </Table>
      )}
      <NewAppModal open={open} setOpen={setOpen} />
      <RegisterCompanyModal
        onClose={() => setCompanyModalOpen(false)}
        open={companyModalOpen}
        afterSubmit={() => setOpen(true)}
      />
      <DeleteAppModal
        app={currentApp}
        open={showDelete}
        setOpen={setShowDelete}
      />
      <RotateModal app={currentApp} open={showRotate} setOpen={setShowRotate} />
      {showEdit && (
        <EditAppModal app={currentApp} open={showEdit} setOpen={setShowEdit} />
      )}
    </TableContainer>
  )
}

export default React.memo(Apps)
