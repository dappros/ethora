import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useStoreState } from "./store";
import AppTopNavAuth from "./componets/AppTopNavAuth";
import AppTopNav from "./componets/AppTopNav";
import "./pages/ChatInRoom/theme/default/main.scss"
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

  return (
    <ThemeProvider theme={viewMode === "light" ? lightTheme : darkTheme}>
      <div className="app-root">
        {firstName ? <AppTopNav /> : <AppTopNavAuth />}
        <Routes />
      </div>
    </ThemeProvider>
  );
}

export default App;
