/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { useNavigation, useRoute } from "@react-navigation/native"
import { Badge, Box, HStack, View, VStack } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { commonColors, defaultMetaRoom, ROOM_KEYS } from "../../../docs/config"
import { useStores } from "../../stores/context"
import { HeaderBalanceButton } from "./HeaderBalanceButton"
import { HeaderMenu } from "./HeaderMenu"
import Ionicons from "react-native-vector-icons/Ionicons"
import { TouchableOpacity } from "react-native-gesture-handler"
import { observer } from "mobx-react-lite"
import { httpGet } from "../../config/apiService"
import { HomeStackNavigationProp } from "../../navigation/types"
import { homeStackRoutes } from "../../navigation/routes"

export const MainHeader = observer(() => {
  const { chatStore, apiStore, loginStore } = useStores()
  const navigation = useNavigation<HomeStackNavigationProp>()
  const route = useRoute()
  const buttons = [
    {
      key: ROOM_KEYS.official,
      icon: "star",
      show: true,
      accessibilityLabel: "Starred chats",
    },
    {
      key: ROOM_KEYS.private,
      icon: "people",
      show: true,
      accessibilityLabel: "Other chats",
    },
    {
      key: ROOM_KEYS.groups,
      icon: "compass",
      show: true,
      accessibilityLabel: "Meta",
    },
  ]

  const navigateToLatestMetaRoom = async () => {
    try {
      const res = await httpGet("/room/currentRoom", loginStore.userToken)
      if (!res.data.result) {
        //@ts-ignore
        navigation.navigate("ChatScreen", {
          chatJid: defaultMetaRoom.jid + apiStore.xmppDomains.CONFERENCEDOMAIN,
        })
        return
      }
      //@ts-ignore
      navigation.navigate("ChatScreen", {
        chatJid:
          res.data.result.roomId.roomJid +
          apiStore.xmppDomains.CONFERENCEDOMAIN,
      })
    } catch (error) {
      console.log(error, "adflkjsdf")

      // showError('Error', 'Cannot fetch latest meta room');
    }
  }

  const onTabPress = async (key: string) => {
    // if user clicked on the Meta button in the header and he is in the chat screen
    if (route.name === homeStackRoutes.ChatScreen && key === ROOM_KEYS.groups) {
      chatStore.toggleMetaNavigation(true)
      chatStore.changeActiveChats(key)
      // if current chat room is not meta one - navigate to latest meta room
      if (
        //@ts-ignore
        !//@ts-ignore
        chatStore.roomList.find((item) => item.jid === route.params?.chatJid)
          ?.meta
      ) {
        await navigateToLatestMetaRoom()
        chatStore.changeActiveChats(key)
      }
      return
    }

    if (key === ROOM_KEYS.groups) {
      chatStore.changeActiveChats(key)

      await navigateToLatestMetaRoom()

      return
    }
    chatStore.changeActiveChats(key)

    navigation.navigate("RoomsListScreem")
  }

  const highlightIcon = (id: string) => {
    return chatStore.activeChats === id
  }
  return (
    <Box
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 6.27,

        elevation: 10,
      }}
      height={hp("9%")}
      justifyContent={"center"}
      bgColor={commonColors.primaryColor}
    >
      <HStack space={3} alignItems="center" justifyContent="space-between">
        <VStack>
          <HStack>
            <HeaderMenu />
          </HStack>
        </VStack>
        {buttons.map((item) => {
          if (!item.show) return null
          return (
            <VStack key={item.key}>
              <TouchableOpacity
                accessibilityLabel={item.accessibilityLabel}
                onPress={async () => await onTabPress(item.key)}
              >
                <Ionicons
                  style={{
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 5,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 6.27,

                    elevation: 5,
                  }}
                  name={item.icon}
                  size={30}
                  color={
                    !highlightIcon(item.key) ? "rgba(255,255,255,0.6)" : "white"
                  }
                />
              </TouchableOpacity>
              {!!chatStore.unreadMessagesForGroups[item.key] && (
                <View style={{ position: "absolute", right: -5, bottom: -4 }}>
                  <Badge
                    colorScheme="danger"
                    rounded="full"
                    zIndex={1111}
                    variant="solid"
                    alignSelf="flex-end"
                    _text={{
                      fontSize: 8,
                    }}
                  >
                    {chatStore.unreadMessagesForGroups[item.key]}
                  </Badge>
                </View>
              )}
            </VStack>
          )
        })}

        <VStack>
          <HStack marginRight={5}>
            <HeaderBalanceButton />
          </HStack>
        </VStack>
      </HStack>
    </Box>
  )
})

const styles = StyleSheet.create({
  appTitleButton: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
})
