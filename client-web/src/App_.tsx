import { ThemeProvider, createTheme } from "@mui/material/styles"
import { useStoreState } from "./store"

import { firebase } from "./services/firebase"
import {
  getFirebaseConfigFromString,
} from "./utils"
import { FullPageSpinner } from "./components_/FullPageSpinner"

import "./pages/ChatInRoom/theme/default/main.scss"
import { Router } from "react-router-dom"
import { history } from "./utils/history"
import { SnackbarContextProvider } from "./context/SnackbarContext"
import "./index.css"
import { useEffect, useState } from "react"
import * as http from "./http"
import { AppConfigNotFound } from "./components_/AppConfigNotFound"

function App_() {
  const [loading, setLoading] = useState(true)
  const [isAppConfigError, setIsAppConfigError] = useState(false)

  const primaryColor = useStoreState((s) => s.config.primaryColor)
  const secondaryColor = useStoreState((s) => s.config.secondaryColor)
  const setConfig = useStoreState((state) => state.setConfig)

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
      setConfig(config)
      firebase.init()
    } catch (error) {
      useStoreState.persist.clearStorage()
      setIsAppConfigError(true)
    }

    setLoading(false)
  }

  useEffect(() => {
    // getAppConfig()
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
                  <div>app</div>
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
