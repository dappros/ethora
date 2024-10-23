import { Avatar, View, Text } from "native-base";
import { StyleSheet } from "react-native";
import React, { FC } from "react";
import { IMessage } from "../../../../stores/chatStore";

interface ChatModalMessageProps {
  selectedMessage: IMessage;
}

const ChatModalMessage: FC<ChatModalMessageProps> = (props) => {
  const { selectedMessage } = props;

  return (
    <View style={styles.modalMessage}>
      <Avatar
        source={{
          uri: selectedMessage.user.avatar ? selectedMessage.user.avatar : "",
        }}
      />
      <View>
        <Text>{selectedMessage.user.name}</Text>
        <Text>{selectedMessage.text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalMessage: {
    backgroundColor: "#FFFFFF",
  },
});

export default ChatModalMessage;
