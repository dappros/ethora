/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React from "react";
import { useNavigation } from "@react-navigation/native";
import { RoomListItemIcon } from "./RoomListItemIcon";
import { Box, HStack, Text, View, VStack } from "native-base";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { observer } from "mobx-react-lite";
import { TouchableOpacity } from "react-native";
import { textStyles } from "../../../docs/config";
import { useStores } from "../../stores/context";
import { format } from "date-fns";
import dayjs from "dayjs";
import { HomeStackNavigationProp } from "../../navigation/types";

interface RoomListProps {
  jid: string;
  name: string;
  counter: number;
  participants: string | number;
  index: number;
  length: number;
}

const removeStringSplits = (str: string) => {
  if (str) {
    return str.trim().split(/\s+/).join(" ");
  }
};
const getTime = (time: Date | undefined) => {
  if (!time) {
    return null;
  }
  try {
    const oneday = 60 * 60 * 24 * 1000;
    const now = Date.now();
    //@ts-ignore
    const isMoreThanADay = now - time > oneday;
    if (isMoreThanADay) {
      return dayjs(time).locale("en").format("MMM D");
    } else {
      return format(new Date(time), "hh:mm");
    }
  } catch (error) {
    return null;
  }
};
export const RoomListItem = observer(
  ({ jid, name, participants }: RoomListProps) => {
    const { chatStore } = useStores();
    const room = chatStore.roomsInfoMap[jid];
    const navigation = useNavigation<HomeStackNavigationProp>();

    const defaultText = "Tap to view and join the conversation.";

    const navigateToChat = () => {
      chatStore.updateBadgeCounter(jid, "CLEAR");
      //@ts-ignore
      navigation.navigate("ChatScreen", { chatJid: jid, chatName: name });
    };

    return (
      <View style={[{ backgroundColor: "white" }]}>
        <Box pl="4" pr="5" py="2">
          <TouchableOpacity onPress={navigateToChat}>
            <HStack justifyContent="space-between" space={3}>
              <View justifyContent={"center"}>
                <RoomListItemIcon
                  name={name}
                  jid={jid}
                  counter={chatStore.roomsInfoMap[jid]?.counter}
                />
              </View>
              <VStack
                justifyContent={"center"}
                flex={1}
                space={0.5}
                position={"relative"}
                borderBottomColor={"#E8EDF2"}
                borderBottomWidth={1}
              >
                <HStack justifyContent={"space-between"} alignItems={"center"}>
                  <Text
                    numberOfLines={1}
                    fontSize={14}
                    fontFamily={textStyles.regularFont}
                    accessibilityLabel="Name"
                    _dark={{
                      color: "warmGray.50",
                    }}
                    color="coolGray.800"
                  >
                    {name}
                  </Text>
                  <VStack>
                    <Text
                      fontSize={12}
                      fontFamily={textStyles.mediumFont}
                      color="#8F8F8F"
                    >
                      {getTime(room?.lastMessageTime)}
                    </Text>
                  </VStack>
                </HStack>
                <HStack>
                  {name && room?.lastUserName && room?.lastUserText ? (
                    <HStack
                      accessibilityLabel="Last message"
                      flex={1}
                      alignItems={"center"}
                      space={1}
                    >
                      <Box>
                        <Text
                          fontFamily={textStyles.semiBoldFont}
                          fontSize={hp("1.7%")}
                          color="#8F8F8F"
                        >
                          {room?.lastUserName && room?.lastUserName + ":"}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          fontFamily={textStyles.regularFont}
                          fontSize={hp("1.5%")}
                          accessibilityLabel={"Last Message"}
                          color="coolGray.600"
                          _dark={{
                            color: "warmGray.100",
                          }}
                        >
                          {room?.lastUserText.length > 10
                            ? removeStringSplits(room?.lastUserText)?.slice(
                                0,
                                10
                              ) + "..."
                            : removeStringSplits(room?.lastUserText)}
                        </Text>
                      </Box>
                    </HStack>
                  ) : (
                    <Text
                      color="coolGray.600"
                      _dark={{
                        color: "warmGray.200",
                      }}
                      fontFamily={textStyles.regularFont}
                    >
                      {defaultText}
                    </Text>
                  )}
                  {room?.counter > 0 && (
                    <Box
                      style={{
                        backgroundColor: `${
                          room?.muted ? "#E8EDF2" : "#0052CD"
                        }`,
                        borderRadius: 8,
                        height: hp(3),
                        width: hp(3),
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        color={`${room?.muted ? "#0052CD" : "white"}`}
                        fontWeight={"semibold"}
                        fontSize={"xs"}
                      >
                        {room?.counter}
                      </Text>
                    </Box>
                  )}
                </HStack>
              </VStack>
            </HStack>
          </TouchableOpacity>
        </Box>
      </View>
    );
  }
);
