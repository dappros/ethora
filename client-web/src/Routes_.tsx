import { Route, Switch } from "react-router"

import AuthPage from "./pages_/AuthPage/AuthPage"
import AuthRoute_ from "./components/AuthRoute_"
import {Chat} from "./pages_/Chat"

export const Routes_ = () => {
  return (
      <Switch>
        <Route path="/auth">
          <AuthPage />
        </Route>
        <AuthRoute_ path="/" exact>
          <Chat />
        </AuthRoute_>
      </Switch>
  )
}
