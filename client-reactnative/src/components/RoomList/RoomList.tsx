/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { useStores } from "../../stores/context"
import { RoomListItem } from "./RoomListItem"
import { View } from "native-base"
import { FlatList } from "react-native"
import { CreateNewChatButton } from "../Chat/CreateNewChatButton"
import { useNavigation } from "@react-navigation/native"
import { HomeStackNavigationProp } from "../../navigation/types"
import { roomListProps } from "../../stores/chatStore"

interface IRoomList {
  roomsList: roomListProps[]
}

export const RoomList: React.FC<IRoomList> = observer((props: IRoomList) => {
  const { chatStore } = useStores()
  const { roomsList } = props
  const sortedRoomsList = roomsList.sort(
    (a: any, b: any) =>
      chatStore.roomsInfoMap[a.jid]?.priority -
      chatStore.roomsInfoMap[b.jid]?.priority
  )
  const navigation = useNavigation<HomeStackNavigationProp>()
  return (
    <>
      <View justifyContent={"center"} alignItems={"center"} w={"full"}>
        <FlatList
          nestedScrollEnabled={true}
          style={{ width: "100%" }}
          data={sortedRoomsList}
          keyExtractor={(item: any) => `${item.jid}`}
          renderItem={({ item, index }) => {
            return (
              <RoomListItem
                index={index}
                length={sortedRoomsList.length}
                counter={item.counter}
                jid={item.jid}
                name={item.name}
                participants={item.participants}
                key={item.jid}
              />
            )
          }}
        />
        <CreateNewChatButton
          onPress={() => navigation.navigate("NewChatScreen")}
        />
      </View>
    </>
  )
})
