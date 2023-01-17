import * as React from "react";
import { Redirect, Route } from "react-router-dom";
import { useStoreState } from "../store";

export default function AuthRoute({ component: Component, ...rest }) {
  const user = useStoreState((state) => state.user);
  return (
    <Route
      {...rest}
      render={(props) =>
        user.firstName ? <Component {...props} /> : <Redirect to="/" />
      }
    ></Route>
  );
}
