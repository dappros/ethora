import React, { useEffect } from "react";
import { Route, Router, Switch } from "react-router";

import { TransactionAddressDetails } from "./Explorer/TransactionAddressDetails";
import { TransactionDetails } from "./Explorer/TransactionDetails";
import { Blocks } from "./Explorer/Blocks";
import { useStoreState } from "../store";
import { getMyAcl } from "../http";
import { FullPageSpinner } from "../componets/FullPageSpinner";
import { checkNotificationsStatus } from "../utils";
import { Provenance } from "./Transactions/Provenance";
import AuthRoute from "../componets/AuthRoute";
import * as http from "../http";
import Dashboard from "./Dashboard";
import { MintNft } from "./MintNft/MintNft";
import { UploadDocument } from "./UploadDocument/UploadDocument";
import { BrowserRouter } from "react-router-dom";
import { RegularSignIn } from "./Signon/RegularSignIn";

const ChatInRoom = React.lazy(() => import("./ChatInRoom"));
const Profile = React.lazy(() => import("./Profile"));
const Signon = React.lazy(() => import("./Signon"));
const Owner = React.lazy(() => import("./Owner"));
const BlockDetails = React.lazy(() => import("./Explorer/BlockDetails"));
const Explorer = React.lazy(() => import("./Explorer/Explorer"));
const UsersPage = React.lazy(() => import("./UsersPage"));

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

  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      <Switch>
        <Route path="/" exact>
          <Signon />
        </Route>
        <Route path="/regularSignIn" component={RegularSignIn} />

        <AuthRoute path="/chat/:roomJID" component={ChatInRoom} />
        <AuthRoute path="/owner" component={Owner} />
        <AuthRoute path="/users" component={UsersPage} />
        <AuthRoute path="/dashboard" component={Dashboard} />
        <Route path="/profile/:wallet">
          <Profile />
        </Route>
        <Route path={"/explorer"} component={Explorer} exact />
        <Route
          path={"/explorer/block/:blockNumber"}
          component={BlockDetails}
          exact
        />
        <Route path={"/explorer/blocks/"} component={Blocks} exact />
        <Route path={"/provenance"} component={Provenance} exact />
        <Route path={"/mint"} component={MintNft} exact />
        <Route path={"/documents/upload"} component={UploadDocument} exact />

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
      </Switch>
    </React.Suspense>
  );
};
