import { ThemeProvider, createTheme } from "@mui/material/styles"
import { useStoreState } from "./store"

import "./pages/ChatInRoom/theme/default/main.scss"
import { Routes_ } from "./Routes_"
import { Router } from "react-router-dom"
import { history } from "./utils/history"
import { SnackbarContextProvider } from "./context/SnackbarContext"
import "./index.css"

function App_() {
  const primaryColor = useStoreState((s) => s.config.primaryColor)
  const secondaryColor = useStoreState((s) => s.config.secondaryColor)

  const lightTheme = createTheme({
    palette: {
      mode: "light",
      primary: { main: primaryColor || "#ffffff" },
      secondary: { main: secondaryColor || "#ffffff" },
    },
  })

  return (
    <Router history={history}>
      <SnackbarContextProvider>
        <ThemeProvider theme={lightTheme}>
          <div className="app-root">
            <Routes_ />
          </div>
        </ThemeProvider>
      </SnackbarContextProvider>
    </Router>
  )
}

export default App_
