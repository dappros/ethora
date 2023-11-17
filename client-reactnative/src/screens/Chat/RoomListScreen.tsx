import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import { View } from "native-base"
import React from "react"

import { RoomsTabBar } from "../../components/RoomList/RoomsTabBar"
import { HomeStackParamList as HomeStackParameterList } from "../../navigation/types"
type ScreenProperties = NativeStackScreenProps<
  HomeStackParameterList,
  "RoomsListScreem"
>

const RoomListScreen = observer(({}: ScreenProperties) => {
  return (
    <View flex={1} backgroundColor={"#EBEFF4"} position={"relative"}>
      <RoomsTabBar />
    </View>
  )
})

export default RoomListScreen
