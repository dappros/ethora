/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { Box, Text, VStack, Image } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { UserProfileInitials } from "./UserProfileInitials"

export const UserProfileBlock = ({
  avatar,
  firstName,
  lastName,
  description,
}: any) => {
  return (
    <VStack>
      <Box
        bg={"white"}
        justifyContent={"center"}
        alignItems={"center"}
        style={styles.borderedContainer}
      >
        <Box
          rounded={"full"}
          w={"100%"}
          justifyContent={"center"}
          alignItems={"center"}
          style={styles.imageContainer}
        >
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              alt={"avatar"}
              width={hp("10.46%")}
              height={hp("10.46%")}
              rounded={"full"}
            />
          ) : (
            <UserProfileInitials firstname={firstName} lastname={lastName} />
          )}
        </Box>
        <VStack
          style={{ marginTop: 60 }}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Text fontSize={hp("2.216%")} fontWeight={"bold"}>
            {firstName + " " + lastName}
          </Text>
          <Text>Description: {description}</Text>
        </VStack>
      </Box>
    </VStack>
  )
}
const styles = StyleSheet.create({
  borderedContainer: {
    position: "relative",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 40,
  },
  imageContainer: {
    position: "absolute",
    top: -40,
    zIndex: 9999,
  },
})
