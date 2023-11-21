/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import React, { useState, useEffect } from "react"
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import TransactionListTab from "../../components/Transactions/TransactionsList"
import SkeletonContent from "react-native-skeleton-content-nonexpo"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import { commonColors, textStyles, coinsMainName } from "../../../docs/config"
import { useStores } from "../../stores/context"
import { Avatar, HStack, VStack } from "native-base"
import SecondaryHeader from "../../components/SecondaryHeader/SecondaryHeader"
import { observer } from "mobx-react-lite"
import {
  createNewRoom,
  roomConfig,
  sendInvite,
  setOwner,
  subscribeToRoom,
} from "../../xmpp/stanzas"
import { underscoreManipulation } from "../../helpers/underscoreLogic"
import Ionicons from "react-native-vector-icons/Ionicons"
import { filterNftBalances, produceNfmtItems } from "../../stores/walletStore"
import { ProfileTabs } from "../../components/Profile/ProfileTabs"
import { useNavigation } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import {
  HomeStackNavigationProp,
  HomeStackParamList,
} from "../../navigation/types"

const { primaryColor, primaryDarkColor } = commonColors
const { boldFont } = textStyles

const firstLayout = [
  {
    width: hp("10.46%"),
    height: hp("10.46%"),
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: hp("10.46%") / 2,
  },
  {
    flex: 1,
    marginTop: hp("5.5%"),
    children: [
      {
        paddingTop: hp("2.4%"),
        backgroundColor: "#FBFB7",
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        height: hp("75%"),
      },
    ],
  },
]
type ScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  "OtherUserProfileScreen"
>

const OtherUserProfileScreen = observer(({ route }: ScreenProps) => {
  const { loginStore, walletStore, apiStore, chatStore, otherUserStore } =
    useStores()
  const navigation = useNavigation<HomeStackNavigationProp>()

  const { setOffset, setTotal, clearPaginationData, anotherUserBalance } =
    walletStore

  const [coinData, setCoinData] = useState([])
  const [itemsData, setItemsData] = useState([])
  const collections = walletStore.anotherUserNfmtCollections

  const [activeTab, setActiveTab] = useState(0)
  const [activeAssetTab, setActiveAssetTab] = useState(1)

  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingVCard, setIsLoadingVCard] = useState(true)

  const [itemsBalance, setItemsBalance] = useState(0)

  const linkToken = route.params?.linkToken
  const anotherUserWalletAddress = route.params.walletAddress
  const anotherUserTransaction = walletStore.anotherUserTransaction
  const transactionCount = walletStore.total

  const onDirectChatPress = () => {
    const otherUserWalletAddress = anotherUserWalletAddress
    const myWalletAddress = loginStore.initialData.walletAddress
    const combinedWalletAddress = [myWalletAddress, otherUserWalletAddress]
      .sort()
      .join("_")

    const roomJid =
      combinedWalletAddress.toLowerCase() +
      apiStore.xmppDomains.CONFERENCEDOMAIN
    const combinedUsersName = [
      loginStore.initialData.firstName,
      loginStore.anotherUserFirstname,
    ]
      .sort()
      .join(" and ")

    const myXmppUserName = underscoreManipulation(myWalletAddress)
    createNewRoom(
      myXmppUserName,
      combinedWalletAddress.toLowerCase(),
      chatStore.xmpp
    )
    setOwner(
      myXmppUserName,
      combinedWalletAddress.toLowerCase(),
      chatStore.xmpp
    )
    roomConfig(
      myXmppUserName,
      combinedWalletAddress.toLowerCase(),
      { roomName: combinedUsersName, roomDescription: "" },
      chatStore.xmpp
    )
    subscribeToRoom(roomJid, myXmppUserName, chatStore.xmpp)

    navigation.navigate("ChatScreen", {
      chatJid: roomJid,
      chatName: combinedUsersName,
    })
    chatStore.toggleShouldCount(false)

    setTimeout(() => {
      sendInvite(
        underscoreManipulation(myWalletAddress),
        roomJid.toLowerCase(),
        underscoreManipulation(otherUserWalletAddress),
        chatStore.xmpp
      )
    }, 3000)
  }
  const calculateBalances = () => {
    setItemsBalance(
      itemsData.reduce((acc, item) => (acc += parseFloat(item.balance)), 0)
    )
  }
  const getBalances = async () => {
    await walletStore.fetchTransaction(anotherUserWalletAddress, 10, 0)
    await walletStore.fetchOtherUserWalletBalance(
      anotherUserWalletAddress,
      loginStore.userToken,
      linkToken || ""
    )
    setIsLoading(false)
    setIsLoadingVCard(false)
  }

  useEffect(() => {
    if (anotherUserBalance?.length > 0) {
      const nfmtItems = produceNfmtItems(anotherUserBalance)
      setCoinData(
        anotherUserBalance.filter(
          (item: any) => item.tokenName === coinsMainName
        )
      )

      setItemsData(
        anotherUserBalance

          .filter(filterNftBalances)
          .concat(nfmtItems)

          .reverse()
      )
      calculateBalances()
    } else {
      setItemsData([])
    }
  }, [anotherUserBalance])

  useEffect(() => {
    calculateBalances()

    return () => {}
  }, [itemsData, coinData])

  useEffect(() => {
    setOffset(0)
    setTotal(0)

    return () => {
      clearPaginationData()
      setCoinData([])
      setIsLoading(true)
      setIsLoadingVCard(true)
      setItemsData([])
    }
  }, [])

  useEffect(() => {
    getBalances()
  }, [anotherUserWalletAddress])

  const loadTabContent = () => {
    if (activeTab === 0) {
      return (
        <ProfileTabs
          activeAssetTab={activeAssetTab}
          setActiveAssetTab={setActiveAssetTab}
          documents={[]}
          collections={collections}
          coinsItems={coinData}
          userWalletAddress={anotherUserWalletAddress}
          nftItems={itemsData}
          itemsBalance={itemsBalance}
        />
      )
    }

    if (activeTab === 1) {
      return (
        <View style={{ paddingBottom: hp("27%") }}>
          <TransactionListTab
            transactions={anotherUserTransaction}
            walletAddress={anotherUserWalletAddress}
            onEndReached={() => {
              if (anotherUserTransaction.length < walletStore.total) {
                walletStore.fetchTransaction(
                  anotherUserWalletAddress,
                  walletStore.limit,
                  walletStore.offset
                )
              }
            }}
          />
        </View>
      )
    }
  }

  const onTransactionNumberPress = () => {
    setActiveTab(1)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ backgroundColor: primaryDarkColor, flex: 1 }}>
        <SecondaryHeader
          title={"User's profile"}
          onBackPress={() =>
            activeTab === 1 ? setActiveTab(0) : navigation.goBack()
          }
        />

        <View style={{ zIndex: +1, alignItems: "center" }}>
          <HStack
            width={hp("10.46%")}
            height={hp("10.46%")}
            position={"absolute"}
            justifyContent={"center"}
            alignItems={"center"}
            bgColor={primaryColor}
            borderRadius={hp("10.46%") / 2}
          >
            <SkeletonContent
              containerStyle={{ alignItems: "center" }}
              layout={firstLayout}
              isLoading={isLoadingVCard}
            >
              <Avatar
                bg={commonColors.primaryColor}
                size={"xl"}
                source={
                  loginStore.anotherUserAvatar !== "none"
                    ? {
                        uri: loginStore.anotherUserAvatar,
                      }
                    : undefined
                }
              >
                {loginStore.anotherUserFirstname[0] +
                  loginStore.anotherUserLastSeen[0]}
              </Avatar>
            </SkeletonContent>
          </HStack>
        </View>
        <View style={{ flex: 1, marginTop: hp("5.5%") }}>
          <VStack
            // paddingTop={hp('2.4%')}
            bgColor={"#FBFBFB"}
            borderTopLeftRadius={30}
            borderTopRightRadius={30}
            height={hp("75%")}
          >
            <View style={{ alignItems: "center", marginTop: hp("5.54%") }}>
              <SkeletonContent
                containerStyle={{ width: wp("100%"), alignItems: "center" }}
                layout={[
                  { width: wp("30%"), height: hp("2.216%"), marginBottom: 6 },
                ]}
                isLoading={isLoadingVCard}
              >
                <HStack>
                  <Text
                    style={{
                      fontSize: hp("2.216%"),
                      fontFamily: textStyles.mediumFont,
                      color: "#000000",
                    }}
                  >
                    {loginStore.anotherUserFirstname}{" "}
                    {loginStore.anotherUserLastname}
                  </Text>
                  <TouchableOpacity
                    accessibilityLabel="User Transactions"
                    onPress={onTransactionNumberPress}
                    style={{ marginLeft: 5 }}
                  >
                    <Text
                      style={{
                        fontSize: hp("2.216%"),
                        fontFamily: textStyles.mediumFont,
                        color: commonColors.primaryColor,
                      }}
                    >
                      (
                      <Text
                        style={{
                          fontSize: hp("2.216%"),
                          fontFamily: textStyles.mediumFont,
                          color: commonColors.primaryColor,
                          textDecorationLine: "underline",
                        }}
                      >
                        {transactionCount}
                      </Text>
                      )
                    </Text>
                  </TouchableOpacity>
                </HStack>
              </SkeletonContent>
              <View
                style={{ padding: hp("4%"), paddingBottom: 0, paddingTop: 0 }}
              >
                <View
                  style={{
                    padding: hp("4%"),
                    paddingBottom: 0,
                    paddingTop: 0,
                  }}
                >
                  <SkeletonContent
                    containerStyle={{ width: wp("100%"), alignItems: "center" }}
                    layout={[{ width: wp("60%"), height: 70, marginBottom: 6 }]}
                    isLoading={isLoadingVCard}
                  >
                    <Text style={styles.descriptionText}>
                      {otherUserStore.description}
                    </Text>
                    <TouchableOpacity
                      accessibilityLabel="Direct message"
                      onPress={onDirectChatPress}
                      style={styles.chatButton}
                    >
                      <HStack alignItems={"center"}>
                        <Ionicons
                          name="chatbubble-ellipses"
                          size={hp("1.7%")}
                          color={"white"}
                        />

                        <Text style={{ color: "white", marginLeft: 5 }}>
                          Chat
                        </Text>
                      </HStack>
                    </TouchableOpacity>
                  </SkeletonContent>
                </View>
              </View>
            </View>

            <View>
              <View style={{ padding: wp("4%") }}>
                <SkeletonContent
                  isLoading={isLoading}
                  containerStyle={{
                    width: "100%",
                    alignItems: "center",
                  }}
                  layout={[
                    { width: wp("90%"), height: hp("2.216%"), marginBottom: 6 },
                  ]}
                >
                  <View style={{ flexDirection: "row" }}></View>
                </SkeletonContent>
              </View>
              <SkeletonContent
                isLoading={isLoading}
                containerStyle={{
                  width: "100%",
                  padding: isLoading ? hp("3%") : 0,
                  alignItems: "center",
                }}
                layout={[
                  { width: wp("90%"), height: hp("30%"), marginBottom: 6 },
                ]}
              >
                {loadTabContent()}
              </SkeletonContent>
            </View>
          </VStack>
        </View>
      </View>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  tokenIconStyle: {
    height: hp("3%"),
    width: hp("3%"),
  },

  mainContainerStyle: {
    backgroundColor: primaryDarkColor,
    flex: 1,
  },
  tabText: {
    fontSize: hp("1.97%"),
    fontFamily: boldFont,
  },
  coinsItemText: {
    fontFamily: textStyles.mediumFont,
    fontSize: hp("1.97%"),
    color: "#000000",
  },
  chatButton: {
    fontSize: hp("2.23%"),
    fontFamily: textStyles.regularFont,
    textAlign: "center",
    color: "0000004D",
    backgroundColor: commonColors.primaryDarkColor,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  descriptionText: {
    fontSize: hp("2.23%"),
    fontFamily: textStyles.regularFont,
    textAlign: "center",
    color: primaryColor,
  },
})

export default OtherUserProfileScreen
