import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useStoreState } from "./store";
import AppTopNavAuth from "./components/AppTopNavAuth";
import AppTopNav from "./components/AppTopNav";
import AppTopNavOwner from "./components/AppTopNavOwner";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo/client";

import "./pages/ChatInRoom/theme/default/main.scss";
import { Routes } from "./pages/Routes";
import { Router } from "react-router-dom";
import { history } from "./utils/history";
import { SnackbarContextProvider } from "./context/SnackbarContext";

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
  return (
    <Router history={history}>
      <SnackbarContextProvider>
        <ThemeProvider theme={viewMode === "light" ? lightTheme : darkTheme}>
          <ApolloProvider client={client}>
            <div className="app-root">
              {!user.firstName && <AppTopNavAuth />}
              {user.firstName && user.xmppPassword && <AppTopNav />}
              {user.firstName && !user.xmppPassword && <AppTopNavOwner />}
              <Routes />
            </div>
          </ApolloProvider>
        </ThemeProvider>
      </SnackbarContextProvider>
    </Router>
  );
}

export default App;
