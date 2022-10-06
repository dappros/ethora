import * as React from "react";
import { Switch, Route } from "react-router-dom";
import Signon from "./pages/Signon";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState } from "./store";
import AppTopNavAuth from "./componets/AppTopNavAuth";
import AppTopNav from "./componets/AppTopNav";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import { Explorer } from "./pages/Explorer/Explorer";
import { TransactionDetails } from "./pages/Explorer/TransactionDetails";
import { TransactionAddressDetails } from "./pages/Explorer/TransactionAddressDetails";

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
  const viewMode = useState((state) => state.viewMode);
  const firstName = useState((state) => state.user.firstName);

  return (
    <ThemeProvider theme={viewMode === "light" ? lightTheme : darkTheme}>
      <div className="app-root">
        {firstName ? <AppTopNav /> : <AppTopNavAuth />}
        <Switch>
          <Route path="/profile/:wallet">
            <Profile />
          </Route>
          <Route path="/chat">
            <Chat />
          </Route>
          <Route path="/" exact>
            <Signon />
          </Route>
          <Route path={'/explorer'} component={Explorer}exact />
          <Route path={'/explorer/transactions/:txId'} component={TransactionDetails} exact/>
          <Route path={'/explorer/address/:address'} component={TransactionAddressDetails} exact/>

        </Switch>
      </div>
    </ThemeProvider>
  );
}

export default App;
