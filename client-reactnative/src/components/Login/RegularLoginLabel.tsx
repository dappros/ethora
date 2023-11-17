import { TouchableOpacity } from "react-native"

import { HStack, Text } from "native-base"

import { commonColors, textStyles } from "../../../docs/config"
import React from "react"

function RegularLoginLabel({ navigation }) {
  return (
    <HStack justifyContent={"center"} marginTop={"30px"} space={"6px"}>
      <Text
        style={{
          fontSize: 12,
          color: commonColors.primaryColor,
          fontFamily: textStyles.regularFont,
        }}
      >
        Already have an account?
      </Text>
      <TouchableOpacity
        testID="login-with-cred"
        accessibilityLabel="Log in with password"
        onPress={() => navigation.navigate("RegularLogin")}
      >
        <Text
          style={{
            fontSize: 12,
            color: commonColors.primaryColor,
            fontFamily: textStyles.semiBoldFont,
            textDecorationLine: "underline",
          }}
        >
          Login
        </Text>
      </TouchableOpacity>
    </HStack>
  )
}

export default RegularLoginLabel
