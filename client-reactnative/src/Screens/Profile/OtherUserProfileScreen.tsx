/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/types";
import MainProfile from "../../components/Profile/MainProfile";

type ScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  "OtherUserProfileScreen"
>;

const OtherUserProfileScreen = ({ route }: ScreenProps) => {
  const linkToken = route.params?.linkToken;
  return <MainProfile profileType="other" linkToken={linkToken} />;
};

export default OtherUserProfileScreen;
