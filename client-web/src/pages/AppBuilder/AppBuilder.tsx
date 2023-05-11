import { useRef, useState } from "react";
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
//interfaces
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

export default function AppBuilder() {
  const [appName, setAppName] = useState("");
  const [bundleId, setBundleId] = useState("com.ethora");
  const [logo, setLogo] = useState<File | null>(null);
  const [loginScreenBackground, setLoginScreenBackground] =
    useState<File | null>(null);
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [coinLogo, setCoinLogo] = useState<File | null>(null);
  const [coinSymbol, setCoinSymbol] = useState("");
  const [coinName, setCoinName] = useState("");
  const [domain, setDomain] = useState("");

  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const appLogoRef = useRef<HTMLInputElement>(null);
  const loginScreenBgRef = useRef<HTMLInputElement>(null);

  //handle to set logo file
  const handleLogoChange = (event: any) => {
    setLogo(event.target.files[0]);
  };

  //handle to set app title

  //handle to set login screen background
  const handleLoginScreenBackgroundChange = (event: any) => {
    setLoginScreenBackground(event.target.files[0]);
  };

  //handle to set coin image
  const handleCoinLogoChange = (event: any) => {
    setCoinLogo(event.target.files[0]);
  };

  //handle for previous button in action strip

  //handle to clear data

  //handle to submit data
  const handleSubmit = () => {
    //accepted data by the backend
    // appName - required
    // bundleId - required
    // email - required
    // appTitle
    // primaryColor
    // secondaryColor
    // coinSymbol
    // coinName
    // logoImage
    // loginScreenBackgroundImage
    // coinLogoImage

    if (bundleId) {
      const data = new FormData();
      data.append("bundleId", bundleId);
      data.append("appName", appName);
      data.append("primaryColor", primaryColor);
      data.append("secondaryColor", secondaryColor);
      data.append("coinSymbol", coinSymbol);
      data.append("coinName", coinName);
      data.append("coinLogoImage", coinLogo as Blob);
      data.append("logoImage", logo as Blob);
      data.append("loginScreenBackgroundImage", loginScreenBackground as Blob);

      const requestOptions = {
        method: "POST",
        body: data,
      };
      fetch("http://localhost:3001/buildapp", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
    }
  };

  return (
    <main>
      <Box
        sx={{
          display: "flex",
          flexDirection: {sm: 'column', md: 'row'} ,
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
                label="Main Color"
                name="mainColor"
                variant="outlined"
                placeholder="#ffffff"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
              />
            </Box>

            <Box>
              <TextField
                margin="dense"
                fullWidth
                label="Secondary Color"
                name="secondaryColor"
                variant="outlined"
                placeholder="#ffffff"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
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
              <Button variant="contained">Prepare React Native build</Button>
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
