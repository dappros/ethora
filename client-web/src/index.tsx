import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router } from "react-router-dom"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import CssBaseline from "@mui/material/CssBaseline"
import { Web3ReactProvider } from "@web3-react/core"
import { providers } from "ethers"
// import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { config } from "./config"

const root = ReactDOM.createRoot(document.querySelector("#root") as HTMLElement)

function getLibrary(provider: any) {
  return new providers.Web3Provider(provider)
}

if (config.DISABLE_STRICT) {
  root.render(
    <Web3ReactProvider getLibrary={getLibrary}>
      <CssBaseline />
      <App />
    </Web3ReactProvider>
  )
} else {
  root.render(
    <Web3ReactProvider getLibrary={getLibrary}>
      <CssBaseline />
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Web3ReactProvider>
  )
}

// serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
