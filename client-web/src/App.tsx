import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useStoreState } from "./store";
import AppTopNavAuth from "./componets/AppTopNavAuth";
import AppTopNav from "./componets/AppTopNav";
import AppTopNavOwner from "./componets/AppTopNavOwner";

import { Routes } from "./pages/Routes";

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
  const firstName = useStoreState((state) => state.user.firstName);
  const ownerFirstName = useStoreState((state) => state.owner.firstName)

  return (
    <ThemeProvider theme={viewMode === "light" ? lightTheme : darkTheme}>
      <div className="app-root">
        { (!firstName && !ownerFirstName) && <AppTopNavAuth /> }
        {!! firstName && <AppTopNav />}
        {!!ownerFirstName && <AppTopNavOwner />}
        <Routes />
      </div>
    </ThemeProvider>
  );
}

export default App;
