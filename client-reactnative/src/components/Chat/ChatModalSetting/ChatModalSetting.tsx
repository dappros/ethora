import React, {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Animated,
  Easing,
} from "react-native";
import { IMessage } from "../../../stores/chatStore";
import { options } from "./options";
import ChatModalMessage from "./ChatModalMessage/ChatModalMessage";

interface ChatModalSettingProps {
  selectedMessage: IMessage | null;
  closeModal?: () => void;
  setSelectedMessage: (prop: IMessage | null) => void;
  setIsUser: (props: boolean | null) => void;
  actionInteractions: (type: string) => void;
  reactionModalPosition: any;
  isModerator: boolean;
  isUser: boolean;
}

export const ChatModalSetting = (
  props: ChatModalSettingProps,
): ReactElement => {
  const {
    selectedMessage,
    setSelectedMessage,
    reactionModalPosition,
    actionInteractions,
    isModerator,
    setIsUser,
    isUser,
  } = props;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [isClosing, setIsClosing] = useState(false);

  const filteredOptions = useMemo(() => {
    return options.filter((option) => {
      if (!isModerator && option.isModerator) {
        return false;
      }
      if (isUser && option.isUser) {
        return false;
      }
      if (!isUser && option.IsEdit) {
        return false;
      }
      return true;
    });
  }, [options, isUser, isModerator]);

  useEffect(() => {
    if (selectedMessage && !isClosing) {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedMessage, isClosing]);

  const handleClose = () => {
    setIsClosing(true);

    setIsClosing(false);
    setIsUser(null);
    setSelectedMessage(null);

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();

    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 150,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setIsClosing(false);
      setIsUser(null);
      setSelectedMessage(null);
    });
  };

  const textModal = useMemo((): ReactElement | null => {
    if (!selectedMessage) {
      return null;
    }
    return (
      <ChatModalMessage selectedMessage={selectedMessage} isUser={isUser} />
    );
  }, [selectedMessage]);

  return (
    <Modal
      visible={!!selectedMessage}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
      style={styles.container}
    >
      <TouchableOpacity
        style={{
          position: "absolute",
          top: reactionModalPosition.top,
          left: reactionModalPosition.left,
          bottom: 0,
          right: 0,
          padding: 15,
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          justifyContent: "center",
          alignItems: isUser ? "flex-end" : "flex-start",
        }}
        onPress={handleClose}
        activeOpacity={1}
      >
        <TouchableOpacity activeOpacity={1} onPress={handleClose}>
          <View style={styles.selectedContainer}>
            <Animated.View style={{ opacity: fadeAnim }}>
              <TouchableOpacity activeOpacity={1}>{textModal}</TouchableOpacity>
            </Animated.View>
            <TouchableOpacity activeOpacity={1} style={styles.optionsContainer}>
              <Animated.View
                style={[
                  styles.optionsContainer,
                  {
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                {filteredOptions.map(({ icon: Icon, ...option }, index) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.option,
                      index === filteredOptions.length - 1 && styles.noBorder,
                    ]}
                    onPress={() => {
                      console.log("option", option.id);
                      actionInteractions(option.id);
                      setSelectedMessage(null);
                    }}
                  >
                    <Text style={{ ...styles.optionText, color: option.color }}>
                      {option.name}
                    </Text>
                    <Icon />
                  </TouchableOpacity>
                ))}
              </Animated.View>
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
