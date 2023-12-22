import { HStack, Text, View, VStack } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import { defaultMetaRoom, ROOM_KEYS, textStyles } from "../../../docs/config";
import React from "react";
import { useStores } from "../../stores/context";
import { homeStackRoutes } from "../../navigation/routes";
import { useNavigation, useRoute } from "@react-navigation/native";
import { httpGet } from "../../config/apiService";
import { HomeStackNavigationProp as HomeStackNavigationProperty } from "../../navigation/types";

const buttons = [
  {
    key: ROOM_KEYS.official,
    icon: "star",
    show: true,
    accessibilityLabel: "Starred chats",
    name: "Favourite",
  },
  {
    key: ROOM_KEYS.private,
    icon: "people",
    show: true,
    accessibilityLabel: "Other chats",
    name: "Groups",
  },
  {
    key: ROOM_KEYS.groups,
    icon: "compass",
    show: true,
    accessibilityLabel: "Meta",
    name: "Private",
  },
];

const highlightIcon = (activeChats, id) => activeChats === id;

const CategoryButton = ({ item, onTabPress, chatStore }) => {
  const isHighlighted = highlightIcon(chatStore.activeChats, item.key);
  return (
    <View key={item.key} style={{ flex: 1 }}>
      <TouchableOpacity
        accessibilityLabel={item.accessibilityLabel}
        onPress={() => onTabPress(item.key)}
        style={{ paddingBottom: 10, position: "relative" }}
      >
        <VStack space={1.5} width={"100%"}>
          <HStack space={2} justifyContent={"center"} alignItems={"center"}>
            <Text
              style={{
                color: "#0052CD",
                fontFamily: isHighlighted
                  ? textStyles.openSansBold
                  : textStyles.openSansRegular,
              }}
            >
              {item.name}
            </Text>
            {chatStore.unreadMessagesForGroups[item.key] > 0 && (
              <NotificationBadge
                count={chatStore.unreadMessagesForGroups[item.key]}
              />
            )}
          </HStack>
          <View
            height={0.5}
            backgroundColor={isHighlighted ? "#0052CD" : "#E8EDF2"}
            borderRadius={5}
          />
        </VStack>
      </TouchableOpacity>
    </View>
  );
};

const NotificationBadge = ({ count }) => (
  <View
    style={{
      paddingRight: 8,
      paddingLeft: 8,
      borderRadius: 5,
      height: 16,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      backgroundColor: "#0052CD",
    }}
  >
    <Text
      style={{
        color: "#fff",
        fontSize: 9,
        position: "absolute",
        top: -3,
        textAlign: "center",
      }}
    >
      {count}
    </Text>
  </View>
);

const RoomsCategories = () => {
  const { chatStore, loginStore, apiStore } = useStores();
  const route = useRoute();
  const navigation = useNavigation<HomeStackNavigationProperty>();

  const navigateToLatestMetaRoom = async () => {
    try {
      const response = await httpGet("/room/currentRoom", loginStore.userToken);
      if (!response.data.result) {
        navigation.navigate("ChatScreen", {
          chatJid: defaultMetaRoom.jid + apiStore.xmppDomains.CONFERENCEDOMAIN,
        });
        return;
      }
      navigation.navigate("ChatScreen", {
        chatJid:
          response.data.result.roomId.roomJid +
          apiStore.xmppDomains.CONFERENCEDOMAIN,
      });
    } catch (error) {
      console.log(error, "adflkjsdf");
    }
  };

  const onTabPress = async (key: string) => {
    // if user clicked on the Meta button in the header and he is in the chat screen
    if (route.name === homeStackRoutes.ChatScreen && key === ROOM_KEYS.groups) {
      chatStore.toggleMetaNavigation(true);
      chatStore.changeActiveChats(key);
      // if current chat room is not meta one - navigate to latest meta room
      if (
        !chatStore.roomList.find((item) => item.jid === route.params?.chatJid)
          ?.meta
      ) {
        await navigateToLatestMetaRoom();
        chatStore.changeActiveChats(key);
      }
      return;
    }

    if (key === ROOM_KEYS.groups) {
      chatStore.changeActiveChats(key);

      await navigateToLatestMetaRoom();

      return;
    }
    chatStore.changeActiveChats(key);

    navigation.navigate("RoomsListScreem");
  };

  return (
    <HStack
      style={{
        width: "100%",
        flexDirection: "row",
        paddingLeft: 20,
        paddingRight: 20,
      }}
      space={"xl"}
    >
      {buttons.map((item) => {
        if (!item.show) return null;
        return (
          <CategoryButton
            item={item}
            onTabPress={onTabPress}
            chatStore={chatStore}
            key={item.key}
          />
        );
      })}
    </HStack>
  );
};

export default RoomsCategories;
