import { useEffect, useRef, useState } from "react";
import AppMock from "../../components/AppBuilder/AppMock";
import {
  Box,
  Button,
  Chip,
  Divider,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { httpWithAuth, updateAppSettings } from "../../http";
import { useParams } from "react-router";
import { intervalToDuration } from "date-fns";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "../../context/SnackbarContext";
import { useStoreState } from "../../store";
import {
  isValidHexCode,
  replaceNotAllowedCharactersInDomain,
} from "../../utils";
import { config } from "../../config";
import useDebounce from "../../hooks/useDebounce";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import InfoIcon from "@mui/icons-material/Info";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
export interface TCustomDetails {
  primaryColor: string;
  secondaryColor: string;
  coinSymbol: string;
  coinName: string;
  currentScreenIndex: number;
  changeScreen: (i: number) => void;

  logo: string;
  loginScreenBackground: string;
  coinLogo: string;
}

type BuildStage = "prepare" | "preparing" | "download";

type IFile = {
  file?: File;
  url: string;
};

export default function AppBuilder() {
  const { appId } = useParams<{ appId: string }>();
  const app = useStoreState((s) => s.apps.find((app) => app._id === appId));
  const updateApp = useStoreState((s) => s.updateApp);

  const [displayName, setDisplayName] = useState(app.displayName || "");
  const [bundleId, setBundleId] = useState(app.bundleId);
  const [logo, setLogo] = useState<IFile>({
    file: undefined,
    url: app.logoImage || "",
  });
  const [loginScreenBackground, setLoginScreenBackground] = useState({
    file: undefined,
    value: app?.loginScreenBackgroundImage || app.loginBackgroundColor || "",
  });
  const [coinLogo, setCoinLogo] = useState<IFile>({
    file: undefined,
    url: app?.coinImage || "",
  });

  const [primaryColor, setPrimaryColor] = useState(app.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(app.secondaryColor);
  const [coinSymbol, setCoinSymbol] = useState("");
  const [coinName, setCoinName] = useState("Coin");

  const [domain, setDomain] = useState(`${app.domainName}`);
  const debouncedDomain = useDebounce<string>(domain, 500);
  const [loading, setLoading] = useState(true);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [buildStage, setBuildStage] = useState<BuildStage>("prepare");
  const [fileTimeToLive, setFileTimeToLive] = useState<Duration>({
    hours: 0,
    minutes: 0,
  });
  const [domainNameError, setDomainNameError] = useState(false);
  const { showSnackbar } = useSnackbar();
  const loginScreenBgRef = useRef<HTMLInputElement>(null);
  const appLogoRef = useRef<HTMLInputElement>(null);

  useEffect(
    () => {
      if (debouncedDomain && debouncedDomain !== app.domainName) {
        validateDomainName(debouncedDomain);
      }
    },
    [debouncedDomain] // Only call effect if debounced search term changes
  );

  const checkBuild = async () => {
    setLoading(true);

    try {
      const res = await httpWithAuth().get("/mobile/check-custom-src/" + appId);

      if (res.data?.isExists) {
        const expiryDate = new Date(res.data.fileStats.birthtime);
        expiryDate.setDate(expiryDate.getDate() + 1);
        const diffInMs = expiryDate.getTime() - new Date().getTime();
        if (diffInMs <= 0) {
          setLoading(false);

          setBuildStage("prepare");
          return;
        }
        const timeToLive = intervalToDuration({
          start: 0,
          end: diffInMs,
        });

        setBuildStage("download");

        setFileTimeToLive(timeToLive);
      }
    } catch (error) {
      showSnackbar(
        "error",
        "Cannot make build" + (error?.response?.data?.error || "")
      );
      console.log(error);
    }
    setLoading(false);
  };

  const getBuild = async () => {
    setLoading(true);

    try {
      const res = await httpWithAuth().get("/mobile/get-custom-src/" + appId, {
        responseType: "blob",
      });
      let fileUrl = window.URL.createObjectURL(new Blob([res.data]));
      const fileName = "client-reactnative.zip";
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      link.click();
      link.remove();
    } catch (error) {
      showSnackbar(
        "error",
        "Cannot make build" + (error?.response?.data?.error || "")
      );

      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    checkBuild();
  }, []);
  const handleLoginScreenBackgroundChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const l = event.target.files[0];
    setLoginScreenBackground({ file: l, value: URL.createObjectURL(l) });
    event.target.files = null;
    event.target.value = null;
  };
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const l = event.target.files[0];
    setLogo({ file: l, url: URL.createObjectURL(l) });
  };

  const handleCoinLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const l = event.target.files[0];
    setCoinLogo({ file: l, url: URL.createObjectURL(l) });
  };

  const validateDomainName = async (domainName: string) => {
    try {
      const res = await httpWithAuth().post("apps/check-domain-name", {
        domainName,
      });
      setDomainNameError(false);
    } catch (error) {
      console.log(error);
      if (domainName !== app.domainName) {
        setDomainNameError(true);
      }
    }
  };

  const createFormData = () => {
    const data = new FormData();

    bundleId && data.append("bundleId", bundleId);
    displayName && data.append("displayName", displayName);
    domain && data.append("domainName", domain);
    primaryColor && data.append("primaryColor", primaryColor);
    secondaryColor && data.append("secondaryColor", secondaryColor);
    coinSymbol && data.append("coinSymbol", coinSymbol);
    coinName && data.append("coinName", coinName);
    coinLogo.file && data.append("coinLogoImage", coinLogo.file);
    logo.file && data.append("logoImage", logo.file);
    if (loginScreenBackground.file) {
      data.append("loginScreenBackgroundImage", loginScreenBackground.file);
    }
    if (
      !loginScreenBackground.file &&
      isValidHexCode(loginScreenBackground.value)
    ) {
      data.append("loginBackgroundColor", loginScreenBackground.value);
    }
    return data;
  };

  const saveSettings = async () => {
    const data = createFormData();

    setLoading(true);
    try {
      const res = await updateAppSettings(appId, data);
      updateApp(res.data.result);
      showSnackbar("success", "Your app is ready to use");
    } catch (error) {
      showSnackbar("error", "Cannot save settings");
      console.log({ error });
    }
    setLoading(false);
  };

  const handleAppNameChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setDisplayName(value);

    const transformedDomain = replaceNotAllowedCharactersInDomain(
      value.toLowerCase().split(" ").join("")
    );
    setDomain(transformedDomain);
    try {
    } catch (error) {}
  };
  const handleDomainNameChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setDomain(value);

    try {
    } catch (error) {}
  };

  const prepareRnBuild = async () => {
    if (
      !bundleId ||
      !isValidHexCode(primaryColor) ||
      !isValidHexCode(secondaryColor)
    ) {
      return;
    }
    setBuildStage("preparing");
    setLoading(true);

    const data = createFormData();

    try {
      const res = await httpWithAuth().post(
        "/mobile/src-builder/" + appId,
        data
      );
      await checkBuild();
      setBuildStage("download");
    } catch (error) {
      setBuildStage("prepare");
      console.log(error);
      showSnackbar("error", "Something went wrong");
    }
    setLoading(false);
  };
  const openAppDomain = () => {
    const url = "https://" + app.domainName + "." + config.DOMAIN_NAME;
    window.open(url, "_blank");
  };
  return (
    <main>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "row" },
          justifyContent: "center",
          gap: 10,
          // justifyContent: "space-between",
        }}
      >
        <Box>
          <fieldset
            style={{
              border: "1px solid rgba(0,0,0,0.3)",
              marginBottom: 20,
              borderRadius: 10,
              padding: 20,
              paddingRight: 100,
            }}
          >
            <legend>
              <Chip
                variant="filled"
                color={"primary"}
                sx={{ fontWeight: "bold" }}
                label={"General Appearance"}
              />
            </legend>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                columnGap: 3,
                rowGap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <input
                  type="color"
                  id="primaryColor"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  style={{
                    outline: "none",
                    border: "1px solid grey",

                    borderRadius: "100%",
                    width: 40,
                    height: 40,
                    backgroundColor: primaryColor,
                    padding: 10,
                  }}
                />
                <label htmlFor="primaryColor">
                  <Typography>Primary Color</Typography>
                </label>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <input
                  type="color"
                  id="secondaryColor"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  style={{
                    outline: "none",
                    borderRadius: "100%",
                    width: 40,
                    height: 40,
                    backgroundColor: secondaryColor,
                    border: "1px solid grey",
                    padding: 10,
                  }}
                />
                <label htmlFor="secondaryColor">
                  <Typography>Secondary Color</Typography>
                </label>
              </Box>
              <Box>
                <TextField
                  margin="dense"
                  fullWidth
                  label="Display Name"
                  name="displayName"
                  variant="outlined"
                  value={displayName}
                  onChange={handleAppNameChange}
                />
              </Box>
              <Box sx={{ position: "relative" }}>
                <TextField
                  margin="dense"
                  fullWidth
                  label="Coin Name"
                  name="coinName"
                  variant="outlined"
                  value={coinName}
                  onChange={(e) => setCoinName(e.target.value)}
                />
                <Tooltip title="Name of your internal coin used for gamification and token economy. Leave “Coin” if unsure.">
                  <InfoIcon
                    sx={{
                      position: "absolute",
                      right: -30,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                </Tooltip>
              </Box>

              <Box sx={{ mb: 2, mt: 1, position: "relative" }}>
                <input
                  onChange={handleLogoChange}
                  ref={appLogoRef}
                  type="file"
                  style={{ display: "none" }}
                />
                <Button
                  // disabled={loading}
                  color="primary"
                  variant="outlined"
                  onClick={() => appLogoRef?.current?.click()}
                  sx={{ width: "100%" }}
                  startIcon={<UploadFileIcon />}
                >
                  {logo?.file?.name || "App Logo"}
                </Button>
                <Typography sx={{ fontSize: 12, color: "rgba(0, 0, 0, 0.6)" }}>
                  Recommended size: 500px x 500px
                </Typography>
              </Box>
              <Box sx={{ mb: 2, mt: 1 }}>
                <input
                  onInput={handleLoginScreenBackgroundChange}
                  ref={loginScreenBgRef}
                  type="file"
                  style={{ display: "none" }}
                />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexDirection: "column",
                    position: "relative",
                  }}
                >
                  <Button
                    // disabled={loading}
                    color="primary"
                    variant="outlined"
                    onClick={() => loginScreenBgRef?.current?.click()}
                    sx={{ width: "100%" }}
                    startIcon={<UploadFileIcon />}
                  >
                    {loginScreenBackground?.file?.name || "Login Background"}
                  </Button>
                  <Divider
                    variant={"fullWidth"}
                    sx={{ color: "black", width: "100%" }}
                  >
                    OR
                  </Divider>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <input
                      type="color"
                      id="loginScreenBackground"
                      value={
                        isValidHexCode(loginScreenBackground.value)
                          ? loginScreenBackground.value
                          : "#fffff"
                      }
                      onChange={(e) =>
                        setLoginScreenBackground({
                          file: undefined,
                          value: e.target.value,
                        })
                      }
                      style={{
                        outline: "none",
                        borderRadius: "100%",
                        width: 40,
                        height: 40,
                        backgroundColor: isValidHexCode(
                          loginScreenBackground.value
                        )
                          ? loginScreenBackground.value
                          : "#fffff",
                        border: "1px solid grey",
                        padding: 10,
                      }}
                    />
                    <label htmlFor="loginScreenBackground">
                      <Typography>Login Screen Color</Typography>
                    </label>
                  </Box>

                  <Tooltip title="Login background or login screen colour is only used for the mobile application.">
                    <InfoIcon
                      sx={{
                        position: "absolute",
                        right: -30,
                        top: 15,
                        transform: "translateY(-50%)",
                      }}
                    />
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          </fieldset>
          <fieldset
            style={{
              border: "1px solid rgba(0,0,0,0.3)",
              marginBottom: 20,
              borderRadius: 10,
              padding: 20,
            }}
          >
            <legend>
              <Chip
                variant="filled"
                color={"primary"}
                sx={{ fontWeight: "bold" }}
                label={"Mobile App"}
              />
            </legend>
            <Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
                <TextField
                  margin="dense"
                  fullWidth
                  sx={{ margin: 0 }}
                  label="Bundle ID"
                  name="bundleId"
                  variant="outlined"
                  onChange={(e) => setBundleId(e.target.value)}
                  value={bundleId}
                  helperText={
                    "Bundle ID should be unique to identify your app for Appstore and other purposes."
                  }
                />
                {buildStage === "download" ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      position: "relative",
                    }}
                  >
                    <Button
                      onClick={getBuild}
                      variant="outlined"
                      color={"success"}
                      sx={{ width: 300, height: 50 }}
                      startIcon={<DownloadIcon />}
                    >
                      Download React Native build
                    </Button>
                    <Typography
                      sx={{ fontSize: 12, color: "rgba(0, 0, 0, 0.6)" }}
                    >
                      Expires in {fileTimeToLive && fileTimeToLive.hours + "h"}{" "}
                      {fileTimeToLive && fileTimeToLive.minutes + "m"}
                    </Typography>
                  </Box>
                ) : (
                  <LoadingButton
                    loading={loading}
                    disabled={buildStage === "preparing"}
                    onClick={prepareRnBuild}
                    sx={{ width: 300, height: 50 }}
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                  >
                    {buildStage === "preparing" ? "Preparing" : "Prepare"} React
                    Native build
                  </LoadingButton>
                )}
              </Box>
            </Box>
          </fieldset>
          <fieldset
            style={{
              border: "1px solid rgba(0,0,0,0.3)",
              marginBottom: 20,
              borderRadius: 10,
              padding: 20,
            }}
          >
            <legend>
              <Chip
                variant="filled"
                color={"primary"}
                sx={{ fontWeight: "bold" }}
                label={"Web App"}
              />
            </legend>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box style={{ display: "flex", alignItems: "center" }}>
                <TextField
                  margin="dense"
                  label="Domain Name"
                  name="domain"
                  variant="outlined"
                  onChange={handleDomainNameChange}
                  value={domain}
                  error={domainNameError}
                  helperText={
                    domainNameError
                      ? "❌ name not available, please fill in something more unique here"
                      : app.domainName === domain
                      ? ""
                      : "✅ available"
                  }
                />
                <Typography
                  style={{
                    marginBottom: app.domainName !== domain ? "20px" : 0,
                  }}
                >
                  {"." + config.DOMAIN_NAME}
                </Typography>
              </Box>
              <Button
                onClick={openAppDomain}
                variant="outlined"
                startIcon={<OpenInNewIcon />}
              >
                Open the Web App
              </Button>
            </Box>
          </fieldset>
          <Box sx={{ display: "flex", mt: 2 }}>
            <LoadingButton
              loading={loading}
              disabled={loading || domainNameError}
              onClick={saveSettings}
              variant="contained"
              sx={{ padding: "10px 40px" }}
            >
              Save
            </LoadingButton>
          </Box>
        </Box>
        <fieldset
          style={{
            border: "1px solid rgba(0,0,0,0.3)",
            borderRadius: 10,
            height: "100%",
            padding: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <legend>
            <Chip
              variant="filled"
              color={"primary"}
              sx={{ fontWeight: "bold" }}
              label={"Mobile App Preview"}
            />
          </legend>
          <AppMock
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            logo={logo.url}
            loginScreenBackground={loginScreenBackground.value}
            coinLogo={coinLogo.url}
            coinSymbol={coinSymbol}
            coinName={coinName}
            currentScreenIndex={currentScreenIndex}
            changeScreen={setCurrentScreenIndex}
          />
        </fieldset>
      </Box>
    </main>
  );
}
