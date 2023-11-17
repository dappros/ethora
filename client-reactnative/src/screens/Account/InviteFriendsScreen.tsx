import React, { useState } from "react"
import { Share, useWindowDimensions } from "react-native"

import { commonColors } from "../../../docs/config"
import { showError } from "../../components/Toast/toast"

import { SceneMap, TabBar, TabView } from "react-native-tab-view"
import { EnterInviteCode } from "./EnterInviteCodeScreen"
import { ShareInviteLink } from "./ShareInviteLinkScreen"
import { useStores } from "../../stores/context"
import { observer } from "mobx-react-lite"
import SecondaryHeader from "../../components/SecondaryHeader/SecondaryHeader"
import { Text } from "native-base"

const routes = [
  { key: "refer", title: "Refer & Earn" },
  { key: "code", title: "Enter code" },
]

export const InviteFriendsScreen = observer(({}) => {
  const [index, setIndex] = useState(0)
  const layout = useWindowDimensions()

  const { loginStore } = useStores()
  const id = loginStore.initialData._id

  const onShare = async () => {
    try {
      await Share.share({
        message: id,
      })
    } catch (error) {
      showError("Error", "Cannot share the link")
    }
  }

  return (
    <>
      <SecondaryHeader title={"Refer & Earn"} />

      <TabView
        navigationState={{ index, routes }}
        renderTabBar={(props) => (
          <TabBar
            renderLabel={({ route, color }) => {
              return (
                <Text
                  accessibilityLabel={route.title}
                  style={{ color, margin: 8 }}
                >
                  {route.title}
                </Text>
              )
            }}
            indicatorStyle={{ backgroundColor: "white" }}
            style={{ backgroundColor: commonColors.primaryDarkColor }}
            {...props}
          />
        )}
        renderScene={SceneMap({
          refer: () => <ShareInviteLink link={id} onPressShare={onShare} />,
          code: () => <EnterInviteCode />,
        })}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </>
  )
})
