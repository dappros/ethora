/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React from "react"
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native"
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen"
import AntIcon from "react-native-vector-icons/AntDesign"
import {
  coinImagePath,
  commonColors,
  defaultBotsList,
  textStyles,
} from "../../../docs/config"
import FastImage from "react-native-fast-image"
import { NFMT_TRAITS, NFMT_TYPES } from "../../stores/walletStore"
import { HStack, VStack } from "native-base"
import { createPrivateChat } from "../../helpers/chat/createPrivateChat"
import { useStores } from "../../stores/context"
import { Button } from "../Button"
import {
  reverseUnderScoreManipulation,
  underscoreManipulation,
} from "../../helpers/underscoreLogic"
import { useNavigation, useRoute } from "@react-navigation/native"
import { botTypes } from "../../constants/botTypes"
import { botStanza } from "../../xmpp/stanzas"
import { formatBigNumber } from "../../helpers/formatBigNumber"
import { isImageMimetype, isVideoMimetype } from "../../helpers/checkMimetypes"
import { HomeStackNavigationProp } from "../../navigation/types"
import { homeStackRoutes } from "../../navigation/routes"

interface NftListItemProps {
  assetUrl: string
  assetsYouHave: string
  totalAssets: string
  name: string
  onClick: any
  nftId: string
  item: any
  mimetype: string
  itemSelected: boolean
  onAssetPress?: () => void
  traitsEnabled?: boolean
}

function truncateString(str, num) {
  if (str.length <= num) {
    return str
  }
  return str.slice(0, num) + "..."
}

export const NfmtTag = ({ tag }: { tag: string }) => {
  return (
    <HStack
      accessibilityLabel="Trait"
      style={{ backgroundColor: NFMT_TRAITS?.[tag]?.color || "green" }}
      paddingX={2}
      borderRadius={5}
      marginX={1}
      paddingY={0.5}
      marginTop={0.5}
    >
      <Text style={{ color: "white", fontSize: hp("1.46%") }}>{tag}</Text>
    </HStack>
  )
}

export const NftListItem = (props: NftListItemProps) => {
  const {
    assetUrl,
    assetsYouHave,
    totalAssets,
    name,
    onClick,
    nftId,
    item,
    mimetype,
    itemSelected,
    onAssetPress,
    traitsEnabled,
  } = props
  const { loginStore, apiStore, chatStore } = useStores()
  const navigation = useNavigation<HomeStackNavigationProp>()
  const route = useRoute()

  const onGetCollectionPress = async () => {
    const bot = defaultBotsList.find(
      (defaultBot) => defaultBot.name === "Merchant Bot"
    )
    const { roomJid, roomName } = await createPrivateChat(
      loginStore.initialData.walletAddress,
      bot.jid,
      loginStore.initialData.firstName,
      bot.name,
      apiStore.xmppDomains.CONFERENCEDOMAIN,
      chatStore.xmpp
    )
    const data = {
      botType: botTypes.mintBot,
      contractAddress: item?.contractAddress,
      senderFirstName: loginStore.initialData.firstName,
      senderLastName: loginStore.initialData.lastName,
    }
    setTimeout(() => {
      botStanza(
        underscoreManipulation(loginStore.initialData.walletAddress),
        roomJid,
        data,
        chatStore.xmpp
      )
      navigation.navigate("ChatScreen", { chatJid: roomJid })
    }, 3000)
  }
  return (
    <View
      accessibilityLabel={"NFT Item"}
      style={[
        styles.container,
        { backgroundColor: itemSelected ? "rgba(0,0,0,0.15)" : "#F4F5F8" },
        item.tokenType === "NFMT" && {
          borderWidth: 1,
          borderColor: NFMT_TYPES[item?.nfmtType]?.color,
        },
      ]}
    >
      <View style={styles.justifyAround}>
        <View style={styles.itemContainer}>
          <View style={styles.imageContainer}>
            {isImageMimetype(mimetype) || isVideoMimetype(mimetype) ? (
              <TouchableWithoutFeedback
                accessibilityLabel="Item preview"
                onPress={onAssetPress}
              >
                <FastImage
                  style={styles.image}
                  source={{
                    // @ts-ignore
                    uri: assetUrl,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </TouchableWithoutFeedback>
            ) : (
              <TouchableWithoutFeedback onPress={onAssetPress}>
                <AntIcon
                  name={"playcircleo"}
                  color={commonColors.primaryColor}
                  size={hp("5%")}
                />
              </TouchableWithoutFeedback>
            )}
          </View>
          <TouchableWithoutFeedback
            onPress={onClick}
            style={{ height: "100%" }}
          >
            <View style={{ alignItems: "flex-start", paddingLeft: 20 }}>
              <Text style={styles.itemName}>{truncateString(name, 15)}</Text>
              {item.isCollection &&
                route.name === homeStackRoutes.OtherUserProfileScreen && (
                  <HStack
                    justifyContent={"flex-end"}
                    alignItems={"center"}
                    marginRight={2}
                  >
                    <Button
                      loading={false}
                      onPress={onGetCollectionPress}
                      title={"Get"}
                      // style={{height: 50}}
                    />
                  </HStack>
                )}
            </View>
          </TouchableWithoutFeedback>
        </View>
        <VStack
          justifyContent={"center"}
          alignItems={"flex-end"}
          marginLeft={"auto"}
        >
          {item?.traits &&
            traitsEnabled &&
            !item.isCollection &&
            item.traits.map((trait, i) => {
              return <NfmtTag tag={trait} key={item} />
            })}
        </VStack>

        <TouchableWithoutFeedback onPress={onClick}>
          <View
            accessibilityLabel="Rarity"
            style={[
              styles.itemCount,
              { minWidth: item.isCollection ? "25%" : "12%" },
            ]}
          >
            <View
              style={{ alignItems: "flex-start", justifyContent: "center" }}
            >
              <Text style={{ color: "black" }}>
                <Text
                  style={{
                    color: item.isCollection ? "green" : "black",
                    fontFamily: item.isCollection
                      ? textStyles.semiBoldFont
                      : textStyles.regularFont,
                  }}
                >
                  {assetsYouHave}
                </Text>
                /{totalAssets}
              </Text>
              {item.isCollection && (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "flex-start",
                    flexDirection: "row",
                  }}
                >
                  <>
                    <Image
                      source={coinImagePath}
                      resizeMode={"contain"}
                      style={styles.tokenIconStyle}
                    />
                    <Text style={{ color: "black" }}>
                      {Math.min(...item.costs)} -{" "}
                    </Text>
                  </>
                  <>
                    <Image
                      source={coinImagePath}
                      resizeMode={"contain"}
                      style={styles.tokenIconStyle}
                    />
                    <Text style={{ color: "black" }}>
                      {formatBigNumber(Math.max(...item.costs))}
                    </Text>
                  </>
                </View>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    height: hp("8.62%"),
    width: "100%",
    backgroundColor: "#F4F5F8",
    borderRadius: 5,
    justifyContent: "center",
    marginBottom: 10,
  },
  justifyAround: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  itemContainer: {
    // width: wp('100%'),

    // backgroundColor: '#F4F5F8',
    flexDirection: "row",
    alignItems: "center",

    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageContainer: {
    width: wp("24%"),
    // flex: 0.24,
    // marginLeft: wp('13%'),
    alignItems: "center",
    justifyContent: "center",
  },
  itemName: {
    fontFamily: textStyles.regularFont,
    fontSize: hp("2.2%"),
    color: "#000000",
    // alignSelf: 'left'
  },
  itemCount: {
    // backgroundColor: '#F4F5F8',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    // paddingRight: 30,
  },
  nfmtStyle: {
    borderWidth: 1,
  },
  tokenIconStyle: {
    height: hp("3%"),
    width: hp("3%"),
  },
})
