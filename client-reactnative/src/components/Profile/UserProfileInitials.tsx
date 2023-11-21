/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { Box, Text } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { commonColors } from "../../../docs/config"

export const UserProfileInitials = ({ firstname, lastname }: any) => {
  return (
    <Box
      bg={commonColors.primaryColor}
      justifyContent={"center"}
      alignItems={"center"}
      rounded={"full"}
      style={styles.container}
    >
      <Text fontSize={28} fontWeight={"bold"} color={"white"}>
        {firstname[0] + lastname[0]}
      </Text>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    width: hp("10.46%"),
    height: hp("10.46%"),
  },
})
