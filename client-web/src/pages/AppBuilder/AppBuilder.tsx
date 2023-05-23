import { useEffect, useRef, useState } from "react";
import AppMock from "../../components/AppBuilder/AppMock";
import { Box, Button, TextField, Typography } from "@mui/material";
import { httpWithAuth } from "../../http";
import { useParams } from "react-router";
import { intervalToDuration } from "date-fns";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "../../context/SnackbarContext";
import { useStoreState } from "../../store";
import { replaceNotAllowedCharactersInDomain } from "../../utils";
import { config } from "../../config";
import useDebounce from "../../hooks/useDebounce";

export interface TCustomDetails {
  primaryColor: string;
  secondaryColor: string;
  coinSymbol: string;
  coinName: string;
  currentScreenIndex: number;
  changeScreen: (i: number) => void;

  logo: File | null;
  loginScreenBackground: File | null;
  coinLogo: File | null;
}

type BuildStage = "prepare" | "preparing" | "download";

function isValidHexCode(str: string) {
  if (!str) {
    return true;
  }
  let regex = new RegExp(/^#([A-Fa-f0-9]{6}|)$/);
  return regex.test(str) === true;
}

export default function AppBuilder() {
  const { appId } = useParams<{ appId: string }>();
  const app = useStoreState((s) =>
    s.apps.find((app) => app._id === appId)
  );
  const [displayName, setDisplayName] = useState(app.displayName || "");
  const [bundleId, setBundleId] = useState("com.ethora");
  const [logo, setLogo] = useState<File | null>(null);
  const [loginScreenBackground, setLoginScreenBackground] =
    useState<File | null>(null);
  const [primaryColor, setPrimaryColor] = useState(app.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(app.secondaryColor);
  const [coinLogo, setCoinLogo] = useState<File | null>(null);
  const [coinSymbol, setCoinSymbol] = useState("");
  const [coinName, setCoinName] = useState("");

  const [domain, setDomain] = useState(`${app.domainName}`);
  const debouncedDomain = useDebounce<string>(domain, 500);
  const [loading, setLoading] = useState(true);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const appLogoRef = useRef<HTMLInputElement>(null);
  const [buildStage, setBuildStage] = useState<BuildStage>("prepare");
  const [fileTimeToLive, setFileTimeToLive] = useState<Duration>({
    hours: 0,
    minutes: 0,
  });
  const [domainNameError, setDomainNameError] = useState(false);
  const { showSnackbar } = useSnackbar();
  const loginScreenBgRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (event: any) => {
    setLogo(event.target.files[0]);
  };

  useEffect(
    () => {
      if (debouncedDomain) {
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
  const handleLoginScreenBackgroundChange = (event: any) => {
    setLoginScreenBackground(event.target.files[0]);
  };

  const handleCoinLogoChange = (event: any) => {
    setCoinLogo(event.target.files[0]);
  };

  const validateDomainName = async (domainName: string) => {
    try {
      const res = await httpWithAuth().post("apps/check-domain-name", {
        domainName,
      });
      console.log(res);
      // setDomain(`${domainName}`);
      setDomainNameError(false);
    } catch (error) {
      console.log(error);
      if(domainName !== app.domainName) {

        setDomainNameError(true);
      }
    }
  };

  const saveSettings = async () => {
    const data = new FormData();

    bundleId && data.append("bundleId", bundleId);
    displayName && data.append("displayName", displayName);
    domain && data.append("domainName", domain);
    primaryColor && data.append("primaryColor", primaryColor);
    secondaryColor && data.append("secondaryColor", secondaryColor);
    coinSymbol && data.append("coinSymbol", coinSymbol);
    coinName && data.append("coinName", coinName);
    coinLogo && data.append("coinLogoImage", coinLogo as Blob);
    logo && data.append("logoImage", logo as Blob);
    loginScreenBackground &&
      data.append("loginScreenBackgroundImage", loginScreenBackground as Blob);
    setLoading(true);
    try {
      const res = await httpWithAuth().put("/apps/" + appId, data);

      console.log({ res });
    } catch (error) {
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
    setDomain(transformedDomain)
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

    const data = new FormData();
    bundleId && data.append("bundleId", bundleId);
    displayName && data.append("displayName", displayName);
    primaryColor && data.append("primaryColor", primaryColor);
    secondaryColor && data.append("secondaryColor", secondaryColor);
    coinSymbol && data.append("coinSymbol", coinSymbol);
    coinName && data.append("coinName", coinName);
    coinLogo && data.append("coinLogoImage", coinLogo as Blob);
    logo && data.append("logoImage", logo as Blob);
    loginScreenBackground &&
      data.append("loginScreenBackgroundImage", loginScreenBackground as Blob);

    try {
      const res = await httpWithAuth().post(
        "/mobile/src-builder/" + appId,
        data
      );
      await checkBuild();
      setBuildStage("download");

      console.log(res.data);
    } catch (error) {
      setBuildStage("prepare");
      console.log(error);
      showSnackbar('error', 'Something went wrong')
    }
    setLoading(false);
  };

  return (
    <main>
      <Box
        sx={{
          display: "flex",
          flexDirection: { sm: "column", md: "row" },
          justifyContent: "center",
          gap: 10,
          // justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: "bold", mb: 2 }}>
            General Appearence
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              columnGap: 3,
            }}
          >
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
            <Box>
              <TextField
                margin="dense"
                fullWidth
                label="Coin Name"
                name="coinName"
                variant="outlined"
                value={coinName}
                onChange={(e) => setCoinName(e.target.value)}
              />
            </Box>
            <Box>
              <TextField
                margin="dense"
                fullWidth
                label="Main Color"
                name="mainColor"
                variant="outlined"
                placeholder="#ffffff"
                InputLabelProps={{ shrink: true }}
                type={"color"}
                value={primaryColor}
                error={!isValidHexCode(primaryColor)}
                onChange={(e) => setPrimaryColor(e.target.value)}
              />
            </Box>

            <Box>
              <TextField
                margin="dense"
                fullWidth
                label="Secondary Color"
                name="secondaryColor"
                variant={"outlined"}
                type={"color"}
                InputLabelProps={{ shrink: true }}
                placeholder="#ffffff"
                value={secondaryColor}
                error={!isValidHexCode(secondaryColor)}
                onChange={(e) => setSecondaryColor(e.target.value)}
              />
            </Box>

            <Box sx={{ gridColumn: "1/3" }}>
              <TextField
                fullWidth
                margin="dense"
                label="Coin symbol (3-4 letters)"
                name="coinSymbol"
                variant="outlined"
                value={coinSymbol}
                onChange={(e) => setCoinSymbol(e.target.value)}
              />
            </Box>
            <Box sx={{ mb: 2, mt: 1 }}>
              <Typography>App Logo</Typography>

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
              >
                {logo?.name || "Upload File"}
              </Button>
            </Box>
            <Box sx={{ mb: 2, mt: 1 }}>
              <input
                onChange={handleLoginScreenBackgroundChange}
                ref={loginScreenBgRef}
                type="file"
                style={{ display: "none" }}
              />
              <Typography>Login Screen Background</Typography>
              <Button
                // disabled={loading}
                color="primary"
                variant="outlined"
                onClick={() => loginScreenBgRef?.current?.click()}
              >
                {loginScreenBackground?.name || "Upload File"}
              </Button>
            </Box>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: "bold", mb: 2 }}>
              Mobile App
            </Typography>
          </Box>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <TextField
                margin="dense"
                fullWidth
                label="Bundle ID"
                name="bundleId"
                variant="outlined"
                onChange={(e) => setBundleId(e.target.value)}
                value={bundleId}
                disabled
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
                    variant="contained"
                    color={"success"}
                    sx={{ width: 300, height: 50 }}
                  >
                    Download React Native build
                  </Button>
                  <Typography
                    sx={{ fontSize: 12, position: "absolute", bottom: -20 }}
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
                  variant="contained"
                >
                  {buildStage === "preparing" ? "Preparing" : "Prepare"} React
                  Native build
                </LoadingButton>
              )}
            </Box>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: "bold", mb: 2 }}>Web App</Typography>
          </Box>
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
                  : app.domainName === domain ? '' : "✅ available"
              }
            />
            <Typography style={{ marginBottom: app.domainName !== domain ?  "20px" : 0 }}>
              {"." + config.DOMAIN_NAME}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <LoadingButton
              loading={loading}
              disabled={loading || domainNameError}
              onClick={saveSettings}
              variant="contained"
            >
              Save
            </LoadingButton>
          </Box>
        </Box>

        <AppMock
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          logo={logo}
          loginScreenBackground={loginScreenBackground}
          coinLogo={coinLogo}
          coinSymbol={coinSymbol}
          coinName={coinName}
          currentScreenIndex={currentScreenIndex}
          changeScreen={setCurrentScreenIndex}
        />
      </Box>
    </main>
  );
}
