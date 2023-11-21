/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import * as React from "react"
import { Text, View, StyleSheet } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { commonColors } from "../../../../docs/config"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import FontistoIcon from "react-native-vector-icons/Fontisto"
import { Pressable } from "native-base"

interface SendItemProps {
  onPress: () => void
  title: string
}

const SendItem = ({ onPress, title }: SendItemProps) => {
  return (
    <Pressable onPress={onPress} accessibilityLabel={"Tap to " + title}>
      <View style={styles.sendItemAndDMContainer}>
        <View style={styles.sendItemAndDMIconContainer}>
          <FontistoIcon name="arrow-swap" size={15} color="black" />
        </View>
        <Text style={{ color: "black" }}>{title}</Text>
      </View>
    </Pressable>
  )
}

export default SendItem

const styles = StyleSheet.create({
  sendItemAndDMContainer: {
    width: wp("50%"),
    height: hp("5%"),
    borderRadius: hp("1%"),
    borderWidth: 1,
    borderColor: commonColors.primaryColor,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  sendItemAndDMIconContainer: {
    position: "absolute",
    left: 10,
  },
})
