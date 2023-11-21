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
import { HomeStackNavigationProp } from "../../navigation/types"

interface RoomListProps {
  jid: string
  name: string
  counter: number
  participants: string | number
  index: number
  length: number
}

const removeStringSplits = (str: string) => {
  if (str) {
    return str.trim().split(/\s+/).join(" ")
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
    if (isMoreThanADay) {
      return dayjs(time).locale("en").format("MMM D")
    } else {
      return format(new Date(time), "hh:mm")
    }
  } catch (error) {
    return null
  }
}
export const RoomListItem = observer(
  ({ jid, name, participants }: RoomListProps) => {
    const { chatStore } = useStores()
    const room = chatStore.roomsInfoMap[jid]
    const navigation = useNavigation<HomeStackNavigationProp>()

    const defaultText = "Tap to view and join the conversation."

    const navigateToChat = () => {
      chatStore.updateBadgeCounter(jid, "CLEAR")
      //@ts-ignore
      navigation.navigate("ChatScreen", { chatJid: jid, chatName: name })
    }
    return (
      <View style={[{ backgroundColor: "white" }]}>
        <Box
          borderBottomWidth="1"
          _dark={{
            borderColor: "gray.600",
          }}
          borderColor="coolGray.200"
          pl="4"
          pr="5"
          py="2"
        >
          <TouchableOpacity onPress={navigateToChat}>
            <HStack justifyContent="space-between">
              <View justifyContent={"center"} flex={0.15}>
                <RoomListItemIcon
                  name={name}
                  jid={jid}
                  counter={chatStore.roomsInfoMap[jid]?.counter}
                />
              </View>

              <VStack justifyContent={"center"} flex={0.7}>
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
                        color="coolGray.500"
                        _dark={{
                          color: "warmGray.100",
                        }}
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
              </VStack>

              <VStack justifyContent={"center"} flex={0.15}>
                <HStack
                  accessibilityLabel="Participants"
                  justifyContent={"flex-end"}
                  alignItems={"center"}
                >
                  <MaterialIcon
                    name="group"
                    color={"black"}
                    size={hp("2%")}
                    style={{
                      marginRight: hp("0.9%"),
                      marginLeft: hp("0.4%"),
                    }}
                  />
                  <Text
                    _dark={{
                      color: "warmGray.200",
                    }}
                    fontFamily={textStyles.semiBoldFont}
                    color={"black"}
                  >
                    {participants}
                  </Text>
                </HStack>
                <Box alignItems={"flex-end"} accessibilityLabel="Updated">
                  <Text
                    fontSize="xs"
                    _dark={{
                      color: "warmGray.50",
                    }}
                    fontFamily={textStyles.mediumFont}
                    color="black"
                  >
                    {getTime(room?.lastMessageTime)}
                  </Text>
                </Box>
              </VStack>
            </HStack>
          </TouchableOpacity>
        </Box>
      </View>
    )
  }
)
