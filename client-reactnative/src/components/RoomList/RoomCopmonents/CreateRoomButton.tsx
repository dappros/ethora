import React from "react";
import { View, Text, HStack } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native-gesture-handler";

const NewChatButton = ({ navigateToNewChat }) => {
  return (
    <View
      style={{
        marginVertical: 8,
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: "#0052CD",
          height: 37,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 30,
        }}
        onPress={navigateToNewChat}
      >
        <HStack space={2} alignItems={"center"} justifyContent={"center"}>
          <Icon name="plus" size={9} color="#fff" />
          <Text style={{ color: "#fff" }}>New chat</Text>
        </HStack>
      </TouchableOpacity>
    </View>
  );
};
export default NewChatButton;
