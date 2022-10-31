import React, { useEffect } from "react";
import { Route, Switch } from "react-router";
import Chat from "./Chat";
import CreateApp from "./CreateApp";
import { BlockDetails } from "./Explorer/BlockDetails";
import { Blocks } from "./Explorer/Blocks";
import ChatInRoom from "./ChatInRoom";
import { Explorer } from "./Explorer/Explorer";
import { TransactionAddressDetails } from "./Explorer/TransactionAddressDetails";
import { TransactionDetails } from "./Explorer/TransactionDetails";
import Owner from "./Owner";
import Profile from "./Profile";
import { Signon } from "./Signon";
import { useStoreState } from "../store";
import { getMyAcl } from "../http";

export const Routes = () => {
  const userToken = useStoreState((state) => state.user.token);

  const ownerToken = useStoreState((state) => state.owner.token);
  const setACL = useStoreState((state) => state.setACL);

  const getAcl = async () => {
    try {
      const res = await getMyAcl();
      setACL(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (userToken || ownerToken) {
      getAcl();
    }
  }, [userToken, ownerToken]);
  return (
    <Switch>
      <Route path="/profile/:wallet">
        <Profile />
      </Route>
      <Route path="/chat">
        <Chat />
      </Route>
      <Route path="/chat-in-room">
        <ChatInRoom />
      </Route>
      <Route path="/" exact>
        <Signon />
      </Route>
      <Route path="/owner" exact>
        <Owner />
      </Route>
      <Route path="/owner/create-app">
        <CreateApp />
      </Route>
      <Route path={"/explorer"} component={Explorer} exact />
      <Route
        path={"/explorer/block/:blockNumber"}
        component={BlockDetails}
        exact
      />
      <Route path={"/explorer/blocks/"} component={Blocks} exact />
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
  );
};
