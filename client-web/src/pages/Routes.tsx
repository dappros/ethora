import React from "react";
import { Route, Switch } from "react-router";
import Chat from "./Chat";
import { BlockDetails } from "./Explorer/BlockDetails";
import { Blocks } from "./Explorer/Blocks";
import { Explorer } from "./Explorer/Explorer";
import { TransactionAddressDetails } from "./Explorer/TransactionAddressDetails";
import { TransactionDetails } from "./Explorer/TransactionDetails";
import Profile from "./Profile";
import {Signon} from "./Signon";

export const Routes = () => {
  return (
    <Switch>
      <Route path="/profile/:wallet">
        <Profile />
      </Route>
      <Route path="/chat">
        <Chat />
      </Route>
      <Route path="/" exact>
        <Signon />
      </Route>
      <Route path={"/explorer"} component={Explorer} exact />
      <Route path={"/explorer/block/:blockNumber"} component={BlockDetails} exact />
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
