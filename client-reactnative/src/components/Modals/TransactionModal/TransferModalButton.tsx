/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import * as React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import { commonColors } from "../../../../docs/config"
import { Text, View } from "native-base"

interface TransferModalButtonProps {
  onPress: any
  title: string
}

export const TransferModalButton: React.FC<TransferModalButtonProps> = ({
  onPress,
  title,
}) => {
  return (
    <TouchableOpacity
      accessibilityLabel="Direct Message"
      onPress={() => {
        onPress()
      }}
    >
      <View style={styles.sendItemAndDMContainer} accessibilityLabel={title}>
        <View style={styles.sendItemAndDMIconContainer}>
          <FontAwesome name="send" size={15} color="black" />
        </View>
        <Text>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

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
