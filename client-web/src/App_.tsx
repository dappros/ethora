import { ThemeProvider, createTheme } from "@mui/material/styles"
import { useZustandStore } from "./store_"

import { firebase } from "./services/firebase_"
import {
  getFirebaseConfigFromString,
} from "./utils/index_"
import { FullPageSpinner } from "./components_/FullPageSpinner"

import "./pages/ChatInRoom/theme/default/main.scss"
import { Router } from "react-router-dom"
import { history } from "./utils/history"
import { SnackbarContextProvider } from "./context/SnackbarContext"
import "./index.css"
import { useEffect, useState } from "react"
import * as http from "./http_"
import { AppConfigNotFound } from "./components_/AppConfigNotFound"
import { Routes_ } from "./Routes_"

function App_() {
  const [loading, setLoading] = useState(true)
  const [isAppConfigError, setIsAppConfigError] = useState(false)

  const primaryColor = useZustandStore((s) => s.applicationConfig.primaryColor)
  const secondaryColor = useZustandStore((s) => s.applicationConfig.secondaryColor)
  const setApplicationConfig = useZustandStore((state) => state.setApplicationConfig)

  const lightTheme = createTheme({
    palette: {
      mode: "light",
      primary: { main: primaryColor || "#ffffff" },
      secondary: { main: secondaryColor || "#ffffff" },
    },
  })

  const getAppConfig = async () => {
    try {
      const res = await http.getConfig()
      const firebaseConfig = getFirebaseConfigFromString(
        res.data.result.firebaseWebConfigString
      )
      const config = { ...res.data.result, firebaseConfig }
      setApplicationConfig(config)
      firebase.init()
    } catch (error) {
      setIsAppConfigError(true)
    }

    setLoading(false)
  }

  useEffect(() => {
    getAppConfig()
  }, [])

  return (
    <Router history={history}>
      <SnackbarContextProvider>
        <ThemeProvider theme={lightTheme}>
          <div className="app-root">
            { isAppConfigError && (
              <AppConfigNotFound />
            ) }

            {
              loading && (
                <FullPageSpinner />
              )
            }

            {
              !isAppConfigError && !loading && (
                <>
                  <Routes_ />
                </>
              )
            }
          </div>
        </ThemeProvider>
      </SnackbarContextProvider>
    </Router>
  )
}

export default App_
