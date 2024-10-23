import React, { ReactElement, useMemo, useRef } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { IMessage } from "../../../stores/chatStore";
import { options } from "./options";
import ChatModalMessage from "./ChatModalMessage/ChatModalMessage";

const { height, width } = Dimensions.get("window");

interface ChatModalSettingProps {
  selectedMessage: IMessage | null;
  isModalVisible?: boolean;
  closeModal: () => void;
  setSelectedMessage: (prop) => void;
  reactionModalPosition: any;
}

export const ChatModalSetting = (
  props: ChatModalSettingProps,
): ReactElement => {
  const {
    selectedMessage,
    setSelectedMessage,
    closeModal,
    reactionModalPosition,
  } = props;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;

  const textModal = useMemo((): ReactElement | null => {
    if (!selectedMessage) {
      return null;
    }
    return <ChatModalMessage selectedMessage={selectedMessage} />;
  }, [selectedMessage]);

  return (
    <Modal
      visible={!!selectedMessage}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setSelectedMessage(null)}
      style={styles.container}
    >
      <TouchableOpacity
        style={{
          position: "absolute",
          top: reactionModalPosition.top,
          left: reactionModalPosition.left,
          bottom: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => setSelectedMessage(null)}
        activeOpacity={1}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setSelectedMessage(null)}
        >
          <View style={styles.selectedContainer}>
            <TouchableOpacity activeOpacity={1}>{textModal}</TouchableOpacity>
            <TouchableOpacity activeOpacity={1} style={styles.optionsContainer}>
              {options.map(({ icon: Icon, ...option }, index) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.option,
                    index === options.length - 1 && styles.noBorder,
                  ]}
                  onPress={() => console.log(option.name, index)}
                >
                  <Text style={{ ...styles.optionText, color: option.color }}>
                    {option.name}
                  </Text>
                  <Icon />
                </TouchableOpacity>
              ))}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    height: "100%",
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  selectedContainer: {
    flex: 1,
    justifyContent: "center",
  },
  selectedMessageText: {
    fontSize: 16,
    color: "black",
  },
  optionsContainer: {
    width: 159,
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 12,
    alignItems: "center",
  },
  option: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#CECECE",
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "400",
  },
});
