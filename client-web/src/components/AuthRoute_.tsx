import { Redirect, Route } from "react-router-dom"
import { useStoreState } from "../store"

export default function AuthRoute_({ component: Component, ...rest }) {
  const user = useStoreState((state) => state.user)
  return (
    <Route
      {...rest}
      render={(properties) =>
        user.firstName ? (
          <Component {...properties} />
        ) : (
          <Redirect to="/auth" />
        )
      }
    ></Route>
  )
}
