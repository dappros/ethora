import React from "react";
import { useStoreState } from "../../store";
import { useParams } from "react-router-dom";
import { MyProfile } from "./MyProfile";
import { OtherProfile } from "./OtherProfile";

export default function Profile() {
  const user = useStoreState((state) => state.user);
  const params: { wallet: string } = useParams();

  if (user.walletAddress === params.wallet) {
    return <MyProfile />;
  } else {
    return <OtherProfile walletAddress={params.wallet} />;
  }
}
