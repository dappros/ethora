import React from "react"
import { Redirect, useLocation } from "react-router-dom"
import { useStoreState } from "../../store"

export interface IHome {}

export const Home: React.FC<IHome> = ({}) => {
  const { search } = useLocation()

  const user = useStoreState((state) => state.user)

  switch (user.homeScreen) {
    case "appCreate": {
      return <Redirect to={"/owner"} />
    }
    case "profile": {
      return <Redirect to={"/profile/" + user.walletAddress} />
    }
    default: {
      return <Redirect to={"/chat/none"} />
    }
  }
}
