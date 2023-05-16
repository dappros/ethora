import { useEffect, useRef, useState } from "react";
import AppMock from "../../components/AppBuilder/AppMock";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { httpWithAuth } from "../../http";
import { useParams } from "react-router";
import {
  intervalToDuration,
  millisecondsToHours,
  millisecondsToMinutes,
} from "date-fns";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "../../context/SnackbarContext";

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
  if(!str) {
    return true
  }
  let regex = new RegExp(/^#([A-Fa-f0-9]{6}|)$/);
  return regex.test(str) === true;
}

export default function AppBuilder() {
  const { appId } = useParams<{ appId: string }>();
  const [appName, setAppName] = useState("");
  const [bundleId, setBundleId] = useState("com.ethora");
  const [logo, setLogo] = useState<File | null>(null);
  const [loginScreenBackground, setLoginScreenBackground] =
    useState<File | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#2559b6');
  const [secondaryColor, setSecondaryColor] = useState("#278b8b");
  const [coinLogo, setCoinLogo] = useState<File | null>(null);
  const [coinSymbol, setCoinSymbol] = useState("");
  const [coinName, setCoinName] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const appLogoRef = useRef<HTMLInputElement>(null);
  const [buildStage, setBuildStage] = useState<BuildStage>("prepare");
  const [fileTimeToLive, setFileTimeToLive] = useState<Duration>({
    hours: 0,
    minutes: 0,
  });
  const {showSnackbar} = useSnackbar()
  const loginScreenBgRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (event: any) => {
    setLogo(event.target.files[0]);
  };

  const checkBuild = async () => {
    setLoading(true);

    try {
      const res = await httpWithAuth().get("/mobile/check-custom-src/" + appId);

      if (res.data?.isExists) {
        const expiryDate = new Date(res.data.fileStats.birthtime);
        expiryDate.setDate(expiryDate.getDate() + 1);
        const timeToLive = intervalToDuration({
          start: 0,
          end: expiryDate.getTime() - new Date().getTime(),
        });
        if (!timeToLive.hours && !timeToLive.minutes && !timeToLive.seconds) {
          setBuildStage("prepare");
          return;
        }
        setBuildStage("download");

        setFileTimeToLive(timeToLive);
      }
    } catch (error) {
      showSnackbar('error', 'Cannot make build' + (error?.response?.data?.error || ''))
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
      showSnackbar('error', 'Cannot make build' + (error?.response?.data?.error || ''))

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

  const handleSubmit = async () => {
    if(!bundleId || !isValidHexCode(primaryColor) || !isValidHexCode(secondaryColor)) {
      return
    }
    setBuildStage("preparing");
    setLoading(true);

      const data = new FormData();
      bundleId && data.append("bundleId", bundleId);
      appName && data.append("appName", appName);
      primaryColor && data.append("primaryColor", primaryColor);
      secondaryColor && data.append("secondaryColor", secondaryColor);
      coinSymbol && data.append("coinSymbol", coinSymbol);
      coinName && data.append("coinName", coinName);
      coinLogo && data.append("coinLogoImage", coinLogo as Blob);
      logo && data.append("logoImage", logo as Blob);
      loginScreenBackground &&
        data.append(
          "loginScreenBackgroundImage",
          loginScreenBackground as Blob
        );

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
                label="App Name"
                name="appName"
                variant="outlined"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
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
                InputLabelProps={{shrink: true}}
                type={'color'}
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
                variant={'outlined'}
                type={'color'}
                InputLabelProps={{shrink: true}}

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
              />
              {buildStage === "download" ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    position: 'relative'
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
                  <Typography sx={{ fontSize: 12, position: 'absolute', bottom: -20 }}>
                    Expires in {fileTimeToLive && fileTimeToLive.hours + "h"}{" "}
                    {fileTimeToLive && fileTimeToLive.minutes + "m"}
                  </Typography>
                </Box>
              ) : (
                <LoadingButton
                  loading={loading}
                  disabled={buildStage === "preparing"}
                  onClick={handleSubmit}
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
          <Box>
            <Box>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Domain</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={domain}
                  label="Domain"
                  onChange={(e) => setDomain(e.target.value)}
                >
                  <MenuItem value={".apps.ethora.com"}>
                    apps.ethora.com
                  </MenuItem>
                  <MenuItem disabled value={"app.YOURDOMAIN.com"}>
                    app.YOURDOMAIN.com
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
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
