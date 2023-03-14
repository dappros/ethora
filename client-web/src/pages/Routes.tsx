import React, { useEffect } from "react";
import { Redirect, Route, Switch } from "react-router";

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
import { onMessageListener } from "../services/firebaseMessaging";
import { ResetPassword } from "./ResetPassword/ResetPassword";
import { VerifyEmail } from "./VerifyEmail/VerifyEmail";
import Organizations from "./Organizations/Organizations";
import Subscriptions from "./Payments";

const ChatInRoom = React.lazy(() => import("./ChatInRoom"));
const ChatRoomDetails = React.lazy(() => import("./ChatRoomDetails"));
const Profile = React.lazy(() => import("./Profile"));
const Signon = React.lazy(() => import("./Signon"));
const Owner = React.lazy(() => import("./Owner"));
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

const mockAcl = {
  result: {
    network: {
      netStats: {
        read: true,
        disabled: ["create", "update", "delete", "admin"],
      },
    },
    application: {
      appCreate: {
        create: true,
        disabled: ["read", "update", "delete", "admin"],
      },
      appSettings: {
        read: true,
        update: true,
        admin: true,
        disabled: ["create", "delete"],
      },
      appUsers: {
        create: true,
        read: true,
        update: true,
        delete: true,
        admin: true,
      },
      appTokens: {
        create: true,
        read: true,
        update: true,
        admin: true,
        disabled: ["delete"],
      },
      appPush: {
        create: true,
        read: true,
        update: true,
        admin: true,
        disabled: ["delete"],
      },
      appStats: {
        read: true,
        admin: true,
        disabled: ["create", "update", "delete"],
      },
    },
  },
};

export const Routes = () => {
  const userId = useStoreState((state) => state.user._id);
  const user = useStoreState((state) => state.user);

  const setACL = useStoreState((state) => state.setACL);
  const setDocuments = useStoreState((state) => state.setDocuments);
  const getAcl = async () => {
    try {
      if (user?.ACL?.ownerAccess) {
        setACL(mockAcl);
        return;
      }
      const res = await getMyAcl();
      setACL({ result: res.data.result[0] });
    } catch (error) {
      console.log(error);
    }
  };

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
  useEffect(() => {
    if (userId) {
      checkNotificationsStatus();
      getAcl();
      getDocuments(user.walletAddress);
    }
  }, [userId]);

  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        console.log(payload);
        sendBrowserNotification(payload.notification.body, () => {});
      })
      .catch((err) => console.log("failed: ", err));
  }, []);

  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      <Switch>
        <Route path={["/signIn/"]} exact>
          <Signon />
        </Route>
        <Route path="/regularSignIn" component={RegularSignIn} />

        <AuthRoute path="/chat/:roomJID" component={ChatInRoom} />
        <AuthRoute path="/chatDetails/:roomJID" component={ChatRoomDetails} />
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

        <Route path="/profile/:wallet">
          <Profile />
        </Route>
        <Route path={"/explorer"} component={Explorer} exact />
        <Route path={"/resetPassword/:token"} component={ResetPassword} exact />
        <Route path={"/verifyEmail/:token"} component={VerifyEmail} exact />
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
          <Redirect
            to={
              user.walletAddress ? "/profile/" + user.walletAddress : "/signIn"
            }
          />
        </Route>
      </Switch>
      <Snackbar />
    </React.Suspense>
  );
};
