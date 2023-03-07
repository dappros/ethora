import React, { useEffect, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useStoreState } from "./store";
import AppTopNavAuth from "./components/AppTopNavAuth";
import AppTopNav from "./components/AppTopNav";
import AppTopNavOwner from "./components/AppTopNavOwner";

import "./pages/ChatInRoom/theme/default/main.scss";
import { Routes } from "./pages/Routes";
import { Router } from "react-router-dom";
import { history } from "./utils/history";
import { SnackbarContextProvider } from "./context/SnackbarContext";
import { HeaderWarningMessage } from "./components/HeaderWarningMessage";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { config } from "./config";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

function App() {
  const viewMode = useStoreState((state) => state.viewMode);
  const user = useStoreState((state) => state.user);
  const showHeaderError = useStoreState((state) => state.showHeaderError);
  const stripe = useMemo(() => loadStripe(config.STRIPE_PUBLISHABLE_KEY), []);
  const stripeOptions = { clientSecret: `${config.STRIPE_SECRET_KEY}` };
  return (
    <Router history={history}>
      <SnackbarContextProvider>
        <Elements stripe={stripe}
         options={stripeOptions}
         >
          <ThemeProvider theme={viewMode === "light" ? lightTheme : darkTheme}>
            <div className="app-root">
              {!user.firstName && <AppTopNavAuth />}
              {user.firstName && user.xmppPassword && <AppTopNav />}
              {user.firstName && !user.xmppPassword && <AppTopNavOwner />}
              {showHeaderError && <HeaderWarningMessage message="Warning" />}
              <Routes />
            </div>
          </ThemeProvider>
        </Elements>
      </SnackbarContextProvider>
    </Router>
  );
}

export default App;
