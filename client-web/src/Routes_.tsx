import React, { useEffect, useState, Suspense, useRef } from "react"
import { Redirect, Route, Switch, useHistory } from "react-router"

import { useStoreState } from "./store"
import { FullPageSpinner } from "./components/FullPageSpinner"
import {
  checkNotificationsStatus,
  getFirebaseConfigFromString,
  sendBrowserNotification,
} from "./utils"
import { MintNft } from "./pages_/MintNft/MintNft"
import { configDocuments } from "./config/config"
import { Snackbar } from "./components/Snackbar"
import AuthRoute from "./components/AuthRoute"
import * as http from "./http"
import { ResetPassword } from "./pages_/ResetPassword/ResetPassword"
import { ChangeTempPassword as ChangeTemporaryPassword } from "./pages_/ChangeTempPassword/ChangeTempPassword"
import Organizations from "./pages_/Organizations/Organizations"
import Subscriptions from "./pages_/Payments"
import { Home } from "./pages_/Home/Home"
import NewChat from "./pages_/NewChat/NewChat"

import AppBuilder from "./pages_/AppBuilder/AppBuilder"
import { AppEdit } from "./pages_/AppEdit/AppEdit"
import AppTopNav from "./components/AppTopNav"
import AppTopNavAuth from "./components/AppTopNavAuth"
import AppTopNavOwner from "./components/AppTopNavOwner"
import { firebase } from "./services/firebase"
import { onMessageListener } from "./services/firebaseMessaging"
import { Box, Typography } from "@mui/material"
import { Helmet } from "react-helmet"

import Owner from "./pages_/Owner"

const ChatInRoom = React.lazy(() => import("./pages_/ChatInRoom"))
const ChatRoomDetails = React.lazy(() => import("./pages_/ChatRoomDetails"))
const Profile = React.lazy(() => import("./pages_/Profile"))
const Auth = React.lazy(() => import("./pages_/Auth"))
// const Owner = React.lazy(() => import("./Owner"));
const BlockDetails = React.lazy(() => import("./pages_/Explorer/BlockDetails"))
const Explorer = React.lazy(() => import("./pages_/Explorer/Explorer"))
const UsersPage = React.lazy(() => import("./pages_/UsersPage"))
const StatisticsPage = React.lazy(() => import("./pages_/Statistics"))
const Dashboard = React.lazy(() => import("./pages_/Dashboard"))
const Privacy = React.lazy(() => import("./pages_/Privacy/Privacy"))
const TransactionAddressDetails = React.lazy(
  () => import("./pages_/Explorer/TransactionAddressDetails")
)
const TransactionDetails = React.lazy(
  () => import("./pages_/Explorer/TransactionDetails")
)
const Blocks = React.lazy(() => import("./pages_/Explorer/Blocks"))
const Provenance = React.lazy(() => import("./pages_/Transactions/Provenance"))
const UploadDocument = React.lazy(
  () => import("./pages_/UploadDocument/UploadDocument")
)
const Referrals = React.lazy(() => import("./pages_/Referrals/Referrals"))
const ChangeBackground = React.lazy(
  () => import("./pages_/ChatRoomDetails/ChangeBackground")
)

export const Routes_ = () => {
  const user = useStoreState((state) => state.user)
  const setConfig = useStoreState((state) => state.setConfig)
  const appConfig = useStoreState((state) => state.config)

  const setDocuments = useStoreState((state) => state.setDocuments)
  const clearUser = useStoreState((state) => state.clearUser)

  const [loading, setLoading] = useState(false)
  const [isAppConfigError, setIsAppConfigError] = useState(false)
  const lastAuthUrl = useRef("")
  const getDefaultChats = useStoreState((state) => state.getDefaultChats)

  const history = useHistory()
  const getDocuments = async (walletAddress: string) => {
    try {
      const docs = await http.httpWithAuth().get(`/docs/${walletAddress}`)

      const documents = docs.data.results
      const mappedDocuments = []
      for (const item of documents) {
        try {
          const { data: file } = await http
            .httpWithAuth()
            .get<http.IDocument[]>("/files/" + item.files[0])
          item.file = file
          mappedDocuments.push(item)
        } catch {
          console.log(item.files[0], "sdjfkls")
        }
      }
      setDocuments(mappedDocuments)
    } catch (error) {
      console.log(error, "404")
    }
  }
  const getRedirect = () => {
    if (user.walletAddress) {
      // if (user.stripeCustomerId) {
      //   return "/organizations";
      // }
      return "/profile/" + user.walletAddress
    }
    return "/signIn"
  }
  if (
    history.location.pathname !== "/signIn" &&
    history.location.pathname !== "/" &&
    !user.walletAddress
  ) {
    lastAuthUrl.current = history.location.pathname
  }

  useEffect(() => {
    getAppConfig()
  }, [])
  useEffect(() => {
    if (appConfig.appToken) {
      getDefaultChats()
    }
  }, [appConfig.appToken])

  useEffect(() => {
    if (user.walletAddress) {
      checkNotificationsStatus()
      getDocuments(user.walletAddress)
    }
  }, [user])

  const getAppConfig = async () => {
    setLoading(true)
    try {
      const res = await http.getConfig()
      const firebaseConfig = getFirebaseConfigFromString(
        res.data.result.firebaseWebConfigString
      )
      const config = { ...res.data.result, firebaseConfig }
      setConfig(config)
      firebase.init()
    } catch (error) {
      clearUser()
      useStoreState.persist.clearStorage()
      setIsAppConfigError(true)
      console.log(error)
    }

    setLoading(false)

    if (appConfig.firebaseWebConfigString) {
      try {
        const payload = await onMessageListener()
        sendBrowserNotification(payload.notification.body, () => {})
      } catch (error) {
        console.log(error)
      }
    }
  }

  if (isAppConfigError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <Typography sx={{ fontWeight: "bold", fontSize: "24px" }}>
          Error, App not found
        </Typography>
      </Box>
    )
  }
  if (loading) {
    return <FullPageSpinner />
  }
  return (
    <Suspense fallback={<FullPageSpinner />}>
      {!user.firstName && <AppTopNavAuth />}
      {user.firstName && user.xmppPassword && <AppTopNav />}
      {user.firstName && !user.xmppPassword && <AppTopNavOwner />}
      <Helmet>
        <title>{appConfig.displayName || "Dappros Platform"}</title>
        <meta
          property="og:title"
          content={appConfig.displayName || "Dappros Platform"}
        />
      </Helmet>
      <Switch>
        <Route path="/auth" exact>
          <Auth />
        </Route>

        <AuthRoute path="/chat/:roomJID" component={ChatInRoom} />
        <AuthRoute path="/chatDetails/:roomJID" component={ChatRoomDetails} />
        <AuthRoute path="/editApp/:appId" component={AppEdit} />

        <AuthRoute path="/owner" component={Owner} />
        <AuthRoute path="/users" component={UsersPage} />
        <AuthRoute path="/dashboard" component={Dashboard} />
        <AuthRoute path="/privacy" component={Privacy} />
        <AuthRoute path="/newchat" component={NewChat} />
        <AuthRoute path="/referrals" component={Referrals} />
        <AuthRoute path="/statistics/:appId" component={StatisticsPage} />
        <AuthRoute path="/changebg/:roomJID" component={ChangeBackground} />
        <AuthRoute path="/organizations" component={Organizations} />
        <AuthRoute path="/payments" component={Subscriptions} />
        <AuthRoute path="/home" component={Home} />

        <AuthRoute path="/appbuilder" component={AppBuilder} />
        <Route path="/profile/:wallet">
          <Profile />
        </Route>
        <Route path={"/explorer"} component={Explorer} exact />
        <Route path={"/resetPassword/:token"} component={ResetPassword} exact />
        <Route
          path={"/tempPassword/"}
          component={ChangeTemporaryPassword}
          exact
        />
        <Route
          path={"/explorer/block/:blockNumber"}
          component={BlockDetails}
          exact
        />
        <Route path={"/explorer/blocks/"} component={Blocks} exact />
        <Route path={"/provenance"} component={Provenance} exact />
        <Route path={"/mint"} component={MintNft} exact />
        {configDocuments && (
          <Route path={"/documents/upload"} component={UploadDocument} exact />
        )}

        <Route
          path={"/explorer/transactions/:txId"}
          component={TransactionDetails}
          exact
        />
        <Route
          path={["/explorer/address/:address", "/explorer/app/:address"]}
          component={TransactionAddressDetails}
          exact
        />
        <Route path={"/"}>
          <Redirect to={getRedirect()} />
        </Route>
      </Switch>
      <Snackbar />
    </Suspense>
  )
}
