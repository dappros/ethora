/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { Box, Text } from "native-base"
import React from "react"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import Ionicons from "react-native-vector-icons/Ionicons"

import { StyleSheet } from "react-native"
export const MessageSize = ({
  size,
  duration,
}: {
  size: string
  duration?: string
}) => {
  return (
    <Box>
      <Box
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"row"}
        bg={"rgba(0,0,0,0.6)"}
        rounded={"md"}
        style={styles.container}
      >
        <Ionicons name="arrow-down-outline" size={hp("1.7%")} color={"white"} />
        <Text color={"white"} fontSize={hp("1.6%")}>
          {size}
        </Text>
      </Box>

      {duration && (
        <Text fontSize={hp("1.6%")} color={"white"}>
          {duration}
        </Text>
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 999,
  },
})
