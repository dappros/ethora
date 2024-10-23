import { Avatar, View, Text } from "native-base";
import { StyleSheet } from "react-native";
import React, { FC, useMemo } from "react";
import { IMessage } from "../../../../stores/chatStore";

interface ChatModalMessageProps {
  selectedMessage: IMessage;
  isUser: boolean;
}

const ChatModalMessage: FC<ChatModalMessageProps> = (props) => {
  const { selectedMessage, isUser } = props;

  const renderAvatar = useMemo(() => {
    const nameParts = selectedMessage.user.name.split(" ");
    const initials = nameParts.map((part) => part[0]).join("");

    return (
      <Avatar
        source={
          selectedMessage.user.avatar
            ? { uri: selectedMessage.user.avatar }
            : undefined
        }
      >
        {!selectedMessage.user.avatar && (
          <Text color="white" fontWeight="bold" fontSize="lg">
            {initials}
          </Text>
        )}
      </Avatar>
    );
  }, [selectedMessage.user.name]);

  const renderDateMessage = useMemo(() => {
    const date = new Date(selectedMessage.createdAt);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    return (
      <Text
        style={styles.modalMessageDate}
      >{`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`}</Text>
    );
  }, [selectedMessage.createdAt]);

  return (
    <View style={styles.modalMessageInfo}>
      <View>{renderAvatar}</View>

      <View
        style={{
          ...styles.modalMessage,
          backgroundColor: isUser ? "#C9E0FA" : "#FFFFFF",
        }}
      >
        <Text style={styles.modalMessageName}>{selectedMessage.user.name}</Text>
        <Text style={styles.modalMessageText}>{selectedMessage.text}</Text>
        <View style={styles.modalMessageDate}>{renderDateMessage}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalMessageInfo: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  modalMessage: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 8,
    borderBottomLeftRadius: 0,
  },
  modalMessageName: {
    fontSize: 14,
    color: "#0052CD",
    fontWeight: "700",
    paddingBottom: 3,
  },
  modalMessageText: {
    fontSize: 14,
    color: "#000000",
  },
  modalMessageDate: {
    color: "#8F8F8F",
    alignItems: "flex-end",
  },
});

export default ChatModalMessage;
