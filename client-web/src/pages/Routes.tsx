import React, { useEffect, useState, Suspense, useRef } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router";

import { useStoreState } from "../store";
import { getMyAcl } from "../http";
import { FullPageSpinner } from "../components/FullPageSpinner";
import { checkNotificationsStatus, sendBrowserNotification } from "../utils";
import { MintNft } from "./MintNft/MintNft";
import { RegularSignIn } from "./Signon/RegularSignIn";
import { configDocuments } from "../config/config";
import { Snackbar } from "../components/Snackbar";
import AuthRoute from "../components/AuthRoute";
import * as http from "../http";
import { ResetPassword } from "./ResetPassword/ResetPassword";
import { ChangeTempPassword } from "./ChangeTempPassword/ChangeTempPassword";
import Organizations from "./Organizations/Organizations";
import Subscriptions from "./Payments";
import { Home } from "./Home/Home";
import AppBuilder from "./AppBuilder/AppBuilder";
import { AppEdit } from "./AppEdit/AppEdit";
import AppTopNav from "../components/AppTopNav";
import AppTopNavAuth from "../components/AppTopNavAuth";
import AppTopNavOwner from "../components/AppTopNavOwner";
import { firebase } from "../services/firebase";
import { onMessageListener } from "../services/firebaseMessaging";
import { Box, Typography } from "@mui/material";
import { useSnackbar } from "../context/SnackbarContext";
import { Helmet } from "react-helmet";

import Owner from "./Owner";

const ChatInRoom = React.lazy(() => import("./ChatInRoom"));
const ChatRoomDetails = React.lazy(() => import("./ChatRoomDetails"));
const Profile = React.lazy(() => import("./Profile"));
const Signon = React.lazy(() => import("./Signon"));
// const Owner = React.lazy(() => import("./Owner"));
const BlockDetails = React.lazy(() => import("./Explorer/BlockDetails"));
const Explorer = React.lazy(() => import("./Explorer/Explorer"));
const UsersPage = React.lazy(() => import("./UsersPage"));
const StatisticsPage = React.lazy(() => import("./Statistics"));
const Dashboard = React.lazy(() => import("./Dashboard"));
const Privacy = React.lazy(() => import("./Privacy/Privacy"));
const TransactionAddressDetails = React.lazy(
  () => import("./Explorer/TransactionAddressDetails")
);
const TransactionDetails = React.lazy(
  () => import("./Explorer/TransactionDetails")
);
const Blocks = React.lazy(() => import("./Explorer/Blocks"));
const Provenance = React.lazy(() => import("./Transactions/Provenance"));
const UploadDocument = React.lazy(
  () => import("./UploadDocument/UploadDocument")
);
const NewChat = React.lazy(() => import("./NewChat/NewChat"));
const Referrals = React.lazy(() => import("./Referrals/Referrals"));
const ChangeBackground = React.lazy(
  () => import("./ChatRoomDetails/ChangeBackground")
);

export const Routes = () => {
  const user = useStoreState((state) => state.user);
  const setConfig = useStoreState((state) => state.setConfig);
  const appConfig = useStoreState((state) => state.config);

  const setDocuments = useStoreState((state) => state.setDocuments);
  const clearUser = useStoreState((state) => state.clearUser);

  const [loading, setLoading] = useState(false);
  const [isAppConfigError, setIsAppConfigError] = useState(false);
  const lastAuthUrl = useRef("");

  const history = useHistory();
  const getDocuments = async (walletAddress: string) => {
    try {
      const docs = await http.httpWithAuth().get(`/docs/${walletAddress}`);

      const documents = docs.data.results;
      const mappedDocuments = [];
      for (const item of documents) {
        try {
          const { data: file } = await http
            .httpWithAuth()
            .get<http.IDocument[]>("/files/" + item.files[0]);
          item.file = file;
          mappedDocuments.push(item);
        } catch (error) {
          console.log(item.files[0], "sdjfkls");
        }
      }
      setDocuments(mappedDocuments);
    } catch (error) {
      console.log(error, "404");
    }
  };
  const getRedirect = () => {
    if (user.walletAddress) {
      // if (user.stripeCustomerId) {
      //   return "/organizations";
      // }
      return "/profile/" + user.walletAddress;
    }
    return "/signIn";
  };
  if (
    history.location.pathname !== "/signIn" &&
    history.location.pathname !== "/" &&
    !user.walletAddress
  ) {
    lastAuthUrl.current = history.location.pathname;
  }

  useEffect(() => {
    getAppConfig();
  }, []);

  useEffect(() => {
    if (user.walletAddress) {
      checkNotificationsStatus();
      getDocuments(user.walletAddress);
    }
   
  }, [user]);

  const getAppConfig = async () => {
    setLoading(true);
    try {
      const config = await http.getConfig();
      setConfig(config.data.result);
      firebase.init();
    } catch (error) {
      clearUser();
      useStoreState.persist.clearStorage();
      setIsAppConfigError(true);
      console.log(error);
    }

    setLoading(false);
    try {
      const payload = await onMessageListener();
      sendBrowserNotification(payload.notification.body, () => {});
    } catch (error) {
      console.log(error);
    }
  };

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
    );
  }
  if (loading) {
    return <FullPageSpinner />;
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
        <Route path={["/signIn/"]} exact>
          <Signon />
        </Route>
        <Route path="/regularSignIn" component={RegularSignIn} />

        <AuthRoute path="/chat/:roomJID" component={ChatInRoom} />
        <AuthRoute path="/chatDetails/:roomJID" component={ChatRoomDetails} />
        <AuthRoute path="/editApp/:appId" component={AppEdit} />

        <AuthRoute path="/owner" component={Owner} />
        <AuthRoute path="/users" component={UsersPage} />
        <AuthRoute path="/dashboard" component={Dashboard} />
        <AuthRoute path="/privacy" component={Privacy} />
        <AuthRoute path="/newchat" component={NewChat} />
        <AuthRoute path="/referrals" component={Referrals} />
        <AuthRoute path="/statistics" component={StatisticsPage} />
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
        <Route path={"/tempPassword/"} component={ChangeTempPassword} exact />
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
  );
};
