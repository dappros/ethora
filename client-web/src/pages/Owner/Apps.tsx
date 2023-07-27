import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { IconButton, Tooltip, Typography } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useStoreState } from "../../store";
import NoDataImage from "../../components/NoDataImage";
import NewAppModal from "./NewAppModal";
import DeleteAppModal from "./DeletAppModal";
import EditAppModal from "./EditAppModal";
import RotateModal from "./RotateModal";
import { RegisterCompanyModal } from "../../components/RegisterCompanyModal";
import { coinsMainName } from "../../config/config";
import { getApps } from "../../http";
import { useSnackbar } from "../../context/SnackbarContext";
import { useHistory } from "react-router";
import SettingsIcon from "@mui/icons-material/Settings";
import { AppsTableHead } from "../../components/AppsTable/AppsTableHead";

const COINS_TO_CREATE_APP = 10;

interface Props {
  onRowClick?: (app: string) => void;
}

const NA = "N/A";

export default function Apps({ onRowClick }: Props) {
  const apps = useStoreState((state) => state.apps);
  const setApps = useStoreState((state) => state.setApps);

  const user = useStoreState((state) => state.user);
  const ACL = useStoreState((state) => state.ACL);
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const mainCoinBalance = useStoreState((state) =>
    state.balance.find((el) => el.tokenName === coinsMainName)
  );
  const isEnoughCoinsToCreateApp =
    +mainCoinBalance?.balance >= COINS_TO_CREATE_APP;
  const currentAcl = ACL.result.find((item) => item.appId === user.appId);
  const canCreateApp = currentAcl?.application?.appCreate?.create;

  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showRotate, setShowRotate] = useState(false);
  const [currentApp, setCurrentApp] = useState({
    _id: "",
    appName: "",
    appDescription: "",
    appGoogleId: "",
    defaultAccessProfileOpen: false,
    defaultAccessAssetsOpen: false,
    usersCanFree: false,
  });
  const { showSnackbar } = useSnackbar();
  const getUserApps = async () => {
    try {
      const apps = await getApps();
      const notNullApps = apps.data.apps.filter((a) => !!a);
      setApps(notNullApps);
    } catch (error) {
      console.log(error);
      showSnackbar("error", "Cannot get user apps");
    }
  };
  const onDelete = (app: any) => {
    setCurrentApp(app);
    setShowDelete(true);
  };

  const onEdit = (app: any) => {
    setCurrentApp(app);
    history.push("/editApp/" + app._id);
    setShowEdit(true);
  };

  const onRotateJwt = (app: any) => {
    setCurrentApp(app);
    setShowRotate(true);
  };
  const onAddApp = () => {
    if (!user.isAgreeWithTerms) {
      setCompanyModalOpen(true);
      return;
    }
    setOpen(true);
  };
  useEffect(() => {
    getUserApps();
  }, []);
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
            !isEnoughCoinsToCreateApp
              ? "You don't have enough coins to create the app."
              : !canCreateApp
              ? "You don't have permission to create app"
              : ""
          }
        >
          <span style={{ marginLeft: "auto" }}>
            <IconButton
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
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <AppsTableHead />
          <TableBody>
            {apps.map((app) => (
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
                  {NA}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  {NA}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  {NA}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  {NA}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  {NA}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  {NA}
                </TableCell>

                <TableCell align="center">
                  {new Date(app.createdAt).toDateString()}
                </TableCell>
                <TableCell align="right">
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <IconButton onClick={() => onEdit(app)}>
                      <SettingsIcon color="primary" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
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
  );
}
