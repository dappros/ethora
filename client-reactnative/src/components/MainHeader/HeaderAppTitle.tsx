/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { useNavigation } from "@react-navigation/native"
import { Box, Text } from "native-base"
import React from "react"
import { Pressable, StyleSheet } from "react-native"
import { appTitle, textStyles } from "../../../docs/config"
import { HomeStackNavigationProp } from "../../navigation/types"
import { useStores } from "../../stores/context"
let counter = 0
export const HeaderAppTitle = () => {
  const navigation = useNavigation<HomeStackNavigationProp>()
  const { debugStore } = useStores()
  const onTitlePress = () => {
    navigation.navigate("RoomsListScreem")
    counter += 1
    if (counter === 3) {
      debugStore.toggleDebugMode(true)
    }
  }
  return (
    <Box ml={2} alignItems={"center"} justifyContent={"center"}>
      <Pressable onPress={onTitlePress} style={styles.appTitleButton}>
        <Text fontFamily={textStyles.boldFont} fontSize={"2xl"} color={"white"}>
          {appTitle}
        </Text>
      </Pressable>
    </Box>
  )
}
const styles = StyleSheet.create({
  appTitleButton: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
})
