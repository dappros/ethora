import React from "react";
import { View, Text, HStack } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native";

const NewChatButton = ({ setModalVisible, disabled = false }) => {
  const handleClick = () => {
    setModalVisible(true);
  };

  return (
    <>
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
          onPress={handleClick}
          disabled={disabled}
        >
          <HStack space={2} alignItems={"center"} justifyContent={"center"}>
            <Icon name="plus" size={9} color="#fff" />
            <Text style={{ color: "#fff" }}>New chat</Text>
          </HStack>
        </TouchableOpacity>
      </View>
    </>
  );
};
export default NewChatButton;
