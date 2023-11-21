/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { HStack, Pressable, Text } from "native-base"
import React from "react"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"

const MAINTABS = {
  transactions: "transactions",
  assets: "assets",
}

export const UserProfileMainTabs = ({ activeTab, onTabPress }: any) => {
  return (
    <>
      <HStack space={5} pl={"1.5"}>
        <Pressable onPress={() => onTabPress(MAINTABS.assets)}>
          <Text
            color={activeTab === MAINTABS.assets ? "black" : "gray.400"}
            fontWeight={"bold"}
            fontSize={hp("1.97%")}
          >
            Assets
          </Text>
        </Pressable>
        <Pressable onPress={() => onTabPress(MAINTABS.transactions)}>
          <Text
            color={activeTab === MAINTABS.transactions ? "black" : "gray.400"}
            fontWeight={"bold"}
            fontSize={hp("1.97%")}
          >
            Transactions
          </Text>
        </Pressable>
      </HStack>
    </>
  )
}
