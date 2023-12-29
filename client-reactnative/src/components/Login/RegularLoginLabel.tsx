import { TouchableOpacity } from "react-native";

import { HStack, Text } from "native-base";

import { textStyles } from "../../../docs/config";
import React from "react";

function RegularLoginLabel({ setOpen }) {
  return (
    <HStack justifyContent={"center"} marginTop={"30px"} space={"6px"}>
      <Text
        style={{
          fontSize: 12,
          color: "#fff",
          fontFamily: textStyles.regularFont,
        }}
      >
        Already have an account?
      </Text>
      <TouchableOpacity
        testID="login-with-cred"
        accessibilityLabel="Log in with password"
        onPress={setOpen}
      >
        <Text
          style={{
            fontSize: 12,
            color: "#fff",
            fontFamily: textStyles.semiBoldFont,
            textDecorationLine: "underline",
          }}
        >
          Login
        </Text>
      </TouchableOpacity>
    </HStack>
  );
}

export default RegularLoginLabel;
