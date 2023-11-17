/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import FontAwesome from "react-native-vector-icons/FontAwesome"

export default function PlayButton({
  state,
  onPress,
}: {
  state: "play" | "pause"
  onPress: () => void
}) {
  return (
    <TouchableOpacity style={styles.playButtonContainer} onPress={onPress}>
      <FontAwesome name={state} size={25} color="white" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  playButtonContainer: {
    // backgroundColor: '#000',
    borderColor: "rgba(93, 63, 106, 0.2)",
    // borderWidth: 16,
    width: 30,
    height: 30,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    // marginHorizontal: 32,
    shadowColor: "#5D3F6A",
    // shadowRadius: 30,
    shadowOpacity: 0.5,
  },
})
