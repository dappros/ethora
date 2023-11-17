/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import * as React from "react"
import { Text, View, StyleSheet, Image } from "react-native"
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import { textStyles } from "../../../../docs/config"

interface AssetItemProps {
  image: string
  assetsYouHave: any
  totalAssets: any
  name: string
  index: any
  itemTransferFunc: any
  selectedItem: any
  nftId: any
}

const AssetItem = (props: AssetItemProps) => {
  const {
    itemTransferFunc,
    selectedItem,
    nftId,
    image,
    name,
    assetsYouHave,
    totalAssets,
  } = props

  return (
    <TouchableWithoutFeedback onPress={itemTransferFunc}>
      <View
        style={{
          height: hp("8.62%"),
          width: "100%",
          backgroundColor:
            selectedItem.nftId === nftId ? "rgba(190, 190, 181, 1)" : "#F4F5F8",

          justifyContent: "center",
          marginBottom: 10,
          padding: 0,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-around",
          }}
        >
          <View
            style={{
              width: wp("100%"),
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: wp("24%"),
                // flex: 0.24,
                // marginLeft: wp('13%'),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                style={{ width: "100%", height: "100%" }}
                source={{
                  uri: image,
                }}
              />
            </View>
            <View style={{ width: wp("60%") }}>
              <Text
                style={{
                  fontFamily: textStyles.regularFont,
                  fontSize: hp("2.2%"),
                  color: "#000000",
                  marginLeft: 20,
                  // alignSelf: 'left'
                }}
              >
                {name}
              </Text>
            </View>
          </View>
          <View
            style={{
              // flex: 0.1,
              // width: wp('70%'),
              // backgroundColor: selectedItem.nftId === nftId? '#000' : '#F4F5F8',

              alignItems: "flex-start",
              justifyContent: "center",
              paddingRight: 50,
            }}
          >
            <Text>
              {assetsYouHave}/{totalAssets}
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default AssetItem
