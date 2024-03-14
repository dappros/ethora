import { Redirect, Route, RouteProps } from "react-router-dom"
import { useZustandStore } from "../store_"

export default function AuthRoute_({ component: Component, ...rest }: RouteProps) {
  const user = useZustandStore((state) => state.user)

  if (!user.firstName) {
    return (
      <Redirect to="/auth" />
    )
  } else {
    return (
      <Route
        {...rest}
        render={(properties) =>
          <Component {...properties} />
        }
      ></Route>
    )
  }
}
