import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useStoreState } from "./store";

import "./pages/ChatInRoom/theme/default/main.scss";
import { Routes } from "./pages/Routes";
import { Router } from "react-router-dom";
import { history } from "./utils/history";
import { SnackbarContextProvider } from "./context/SnackbarContext";
import { firebase } from "./services/firebase";
import { onMessageListener } from "./services/firebaseMessaging";
import { sendBrowserNotification } from "./utils";
import { getConfig } from "./http";
import { useState, useEffect } from "react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const setConfig = useStoreState((state) => state.setConfig);

  const primaryColor = useStoreState((s) => s.config.primaryColor);
  const secondaryColor = useStoreState((s) => s.config.secondaryColor);
  const [loading, setLoading] = useState(true);

  const getAppConfig = async () => {
    setLoading(true);
    try {
      const config = await getConfig();
      setConfig(config.data.result);
      firebase.init();
      const payload = await onMessageListener();
      sendBrowserNotification(payload.notification.body, () => {});
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    getAppConfig();
  }, []);

 
  const lightTheme = createTheme({
    palette: {
      mode: "light",
      primary: { main: primaryColor },
      secondary: { main: secondaryColor },
    },
  });
  return (
    <Router history={history}>
      <SnackbarContextProvider>
        <ThemeProvider theme={lightTheme}>
          <div className="app-root">
            {/* {showHeaderError && <HeaderWarningMessage message="Warning" />} */}
            <Routes />
          </div>
        </ThemeProvider>
      </SnackbarContextProvider>
    </Router>
  );
}

export default App;
