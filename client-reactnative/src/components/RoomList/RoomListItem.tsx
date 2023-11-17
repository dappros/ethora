/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React from "react"
import { useNavigation } from "@react-navigation/native"
import { RoomListItemIcon } from "./RoomListItemIcon"
import { Box, HStack, Text, View, VStack } from "native-base"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import MaterialIcon from "react-native-vector-icons/MaterialIcons"
import { observer } from "mobx-react-lite"
import { TouchableOpacity } from "react-native"
import { textStyles } from "../../../docs/config"
import { useStores } from "../../stores/context"
import { format } from "date-fns"
import dayjs from "dayjs"
import { HomeStackNavigationProp as HomeStackNavigationProperty } from "../../navigation/types"

interface RoomListProperties {
  jid: string
  name: string
  counter: number
  participants: string | number
  index: number
  length: number
}

const removeStringSplits = (string_: string) => {
  if (string_) {
    return string_.trim().split(/\s+/).join(" ")
  }
}
const getTime = (time: Date | undefined) => {
  if (!time) {
    return null
  }
  try {
    const oneday = 60 * 60 * 24 * 1000
    const now = Date.now()
    //@ts-ignore
    const isMoreThanADay = now - time > oneday
    return isMoreThanADay
      ? dayjs(time).locale("en").format("MMM D")
      : format(new Date(time), "hh:mm")
  } catch {
    return null
  }
}
export const RoomListItem = observer(
  ({ jid, name, participants, length, index }: RoomListProperties) => {
    const { chatStore } = useStores()
    const room = chatStore.roomsInfoMap[jid]
    const navigation = useNavigation<HomeStackNavigationProperty>()
    const isLast = index === length - 1

    const defaultText = "Tap to view and join the conversation."

    const navigateToChat = () => {
      chatStore.updateBadgeCounter(jid, "CLEAR")
      navigation.navigate("ChatScreen", { chatJid: jid, chatName: name })
    }
    console.log(
      "chatStore.roomsInfoMap[jid]?.counter",
      chatStore.roomsInfoMap[jid]?.counter
    )
    return (
      <View>
        <Box pl="4" pr="5" py="2">
          <TouchableOpacity onPress={navigateToChat}>
            <HStack space={4}>
              <View justifyContent={"center"} backgroundColor={"transparent"}>
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
              >
                <HStack justifyContent={"space-between"} alignItems={"center"}>
                  <Text
                    numberOfLines={1}
                    fontSize={hp("2%")}
                    fontFamily={textStyles.semiBoldFont}
                    accessibilityLabel="Name"
                    _dark={{
                      color: "warmGray.50",
                    }}
                    color="coolGray.800"
                  >
                    {name}
                  </Text>
                  <Text
                    fontSize="xs"
                    fontFamily={textStyles.mediumFont}
                    color="#8F8F8F"
                  >
                    {getTime(room?.lastMessageTime)}
                  </Text>
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
                          fontWeight={600}
                        >
                          {room?.lastUserName && room?.lastUserName + ":"}
                        </Text>
                      </Box>

                      <Box>
                        <Text
                          fontFamily={textStyles.regularFont}
                          fontSize={hp("1.5%")}
                          accessibilityLabel={"Last Message"}
                          color="#8F8F8F"
                          fontWeight={400}
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
                      color="#8F8F8F"
                      fontWeight={400}
                      fontFamily={textStyles.regularFont}
                    >
                      {defaultText}
                    </Text>
                  )}
                  {chatStore.roomsInfoMap[jid]?.counter ? (
                    <Box
                      backgroundColor={"#0052CD"}
                      borderRadius={7}
                      paddingLeft={1.5}
                      paddingTop={0.7}
                      paddingBottom={0.7}
                      paddingRight={1.5}
                    >
                      <Text color={"#fff"}>
                        {chatStore.roomsInfoMap[jid]?.counter}
                      </Text>
                    </Box>
                  ) : null}
                </HStack>
                {!isLast && (
                  <Box
                    height={0.45}
                    backgroundColor={"#E8EDF2"}
                    marginTop={2}
                    position={"absolute"}
                    width={"100%"}
                    bottom={-10}
                    left={0}
                  ></Box>
                )}
              </VStack>
            </HStack>
          </TouchableOpacity>
        </Box>
      </View>
    )
  }
)
