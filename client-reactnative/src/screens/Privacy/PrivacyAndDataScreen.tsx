import { Text } from "native-base"
import React, { useMemo, useState } from "react"
import { widthPercentageToDP } from "react-native-responsive-screen"
import { SceneMap, TabBar, TabView } from "react-native-tab-view"
import { textStyles, commonColors } from "../../../docs/config"
import SecondaryHeader from "../../components/SecondaryHeader/SecondaryHeader"
import { Blocking } from "./Blocking"
import { DocumentShares } from "./DocumentShares"
import { ManageData } from "./ManageData"
import { ProfileShare } from "./ProfileShare"
import { Visibility } from "./Visibility"
const renderTabBar = (props: any) => {
  return (
    <TabBar
      renderLabel={({ route, focused }) => (
        <Text
          color={focused ? "white" : "info.200"}
          fontSize={10}
          textAlign={"center"}
          fontFamily={textStyles.semiBoldFont}
        >
          {route.title}
        </Text>
      )}
      {...props}
      indicatorStyle={{ backgroundColor: "white" }}
      style={{ backgroundColor: commonColors.primaryDarkColor }}
    />
  )
}
export const PrivacyAndDataScreen = () => {
  const [routeIndex, setRouteIndex] = useState(0)

  const routes = [
    { key: "visibility", title: "Visibility" },
    { key: "profileShares", title: "Profile Shares" },
    { key: "documentShares", title: "Document Shares" },
    { key: "blocking", title: "Blocking" },
    { key: "manageData", title: "Manage Data" },
  ]
  const scene = useMemo(() => {
    return SceneMap({
      visibility: () => <Visibility changeScreen={setRouteIndex} />,
      profileShares: () => <ProfileShare />,
      documentShares: () => <DocumentShares />,
      blocking: () => <Blocking />,
      manageData: () => <ManageData />,
    })
  }, [])
  return (
    <>
      <SecondaryHeader title={"Privacy and Data"} />
      <TabView
        swipeEnabled={false}
        renderTabBar={renderTabBar}
        navigationState={{
          index: routeIndex,
          routes: routes,
        }}
        renderScene={scene}
        onIndexChange={setRouteIndex}
        initialLayout={{ width: widthPercentageToDP("100%") }}
      />
    </>
  )
}
