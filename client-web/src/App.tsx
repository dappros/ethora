import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useStoreState } from "./store";
import AppTopNavAuth from "./componets/AppTopNavAuth";
import AppTopNav from "./componets/AppTopNav";
import AppTopNavOwner from "./componets/AppTopNavOwner";

import "./pages/ChatInRoom/theme/default/main.scss";
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
  const user = useStoreState((state) => state.user);

  return (
    <ThemeProvider theme={viewMode === "light" ? lightTheme : darkTheme}>
      <div className="app-root">
        {!user.firstName && <AppTopNavAuth />}
        {user.firstName && !user.ACL?.ownerAccess && <AppTopNav />}
        {user.ACL?.ownerAccess && <AppTopNavOwner />}
        <Routes />
      </div>
    </ThemeProvider>
  );
}

export default App;
