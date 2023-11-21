import { useNavigation } from "@react-navigation/native"
import { HStack, VStack } from "native-base"
import React, { useState } from "react"
import { FlatList, Image, StyleSheet, Text, View } from "react-native"
import {
  coinImagePath,
  coinReplacedName,
  commonColors,
  itemsTransfersAllowed,
  textStyles,
} from "../../../docs/config"
import { IDocument, TBalance } from "../../stores/types"
import { NftListItem } from "../Transactions/NftListItem"
import { DocumentListItem } from "./DocumentListItem"
import { ProfileTab } from "./ProfileTab"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import { NftMediaModal } from "../NftMediaModal"
import { HomeStackNavigationProp } from "../../navigation/types"

const renderItem = ({ item, index }: { item: any; index: number }) => (
  <Item
    tokenSymbol={item.tokenSymbol}
    tokenName={item.tokenName}
    balance={item.balance}
    index={index}
  />
)

const Item = ({
  balance,
}: {
  tokenSymbol: string
  tokenName: string
  balance: string
  index: number
}) => (
  <HStack
    paddingX={10}
    justifyContent={"space-between"}
    alignItems={"center"}
    width={"full"}
  >
    <HStack justifyContent={"center"} alignItems={"center"}>
      <Image source={coinImagePath} style={styles.tokenIconStyle} />

      <Text style={styles.coinsItemText}>{/* {tokenSymbol} */}</Text>
    </HStack>
    <VStack justifyContent={"center"} alignItems={"center"}>
      <Text style={styles.coinsItemText}>{coinReplacedName}</Text>
    </VStack>
    <VStack justifyContent={"center"} alignItems={"center"}>
      <Text style={[styles.coinsItemText]}>
        {parseFloat(balance).toFixed(0)}
      </Text>
    </VStack>
  </HStack>
)
const RenderAssetItem = ({
  item,
  onClick,
  selectedItem,
  onAssetPress,
}: {
  item: any
  onClick: any
  selectedItem?: string
  onAssetPress: () => void
}) => (
  <NftListItem
    assetUrl={item.imagePreview || item.nftFileUrl}
    name={item.tokenName}
    assetsYouHave={item.balance}
    totalAssets={item.total}
    onClick={onClick}
    itemSelected={!!selectedItem}
    nftId={item.nftId}
    mimetype={item.nftMimetype}
    onAssetPress={onAssetPress}
    traitsEnabled
    // balance={item.balance._hex ? parseInt(item.balance._hex, 16) : item.balance}
    item={item}
  />
)

export interface IProfileTabs {
  activeAssetTab: number
  setActiveAssetTab: React.Dispatch<React.SetStateAction<number>>
  documents: IDocument[]
  collections: Array<any>
  nftItems: Array<TBalance>
  coinsItems: Array<any>
  userWalletAddress: string
  itemsBalance: number | string
}

export const ProfileTabs: React.FC<IProfileTabs> = ({
  activeAssetTab,
  setActiveAssetTab,
  documents,
  collections,
  nftItems,
  userWalletAddress,
  coinsItems,
  itemsBalance,
}) => {
  const navigation = useNavigation<HomeStackNavigationProp>()

  const [mediaModalData, setMediaModalData] = useState({
    open: false,
    url: "",
    mimetype: "",
  })

  return (
    <View style={{ marginTop: hp("1%"), backgroundColor: "white" }}>
      <HStack paddingX={wp("4%")}>
        {itemsTransfersAllowed && !!nftItems.length && (
          <ProfileTab
            isTabActive={activeAssetTab === 1}
            onPress={() => setActiveAssetTab(1)}
            text={`Items (${itemsBalance})`}
            accessibilityLabel="View your NFTs"
          />
        )}

        {collections.length > 0 && (
          <ProfileTab
            isTabActive={activeAssetTab === 2}
            onPress={() => setActiveAssetTab(2)}
            text={`Collections (${collections.length})`}
            accessibilityLabel="View your NFT collections"
          />
        )}
        {documents.length > 0 && (
          <ProfileTab
            isTabActive={activeAssetTab === 3}
            onPress={() => setActiveAssetTab(3)}
            text={`Documents (${documents.length})`}
            accessibilityLabel="View your documents"
          />
        )}
      </HStack>

      <View style={{ marginBottom: hp("34%"), backgroundColor: "white" }}>
        {activeAssetTab === 1 &&
          nftItems.length === 0 &&
          documents.length === 0 && (
            <FlatList
              data={coinsItems}
              nestedScrollEnabled={true}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        {activeAssetTab === 1 && !!nftItems.length && (
          <FlatList
            data={nftItems}
            renderItem={(e) => (
              <RenderAssetItem
                item={e.item}
                onClick={() =>
                  navigation.navigate("NftItemHistory", {
                    item: e.item,
                    userWalletAddress: userWalletAddress,
                  })
                }
                onAssetPress={() => {
                  setMediaModalData({
                    open: true,
                    url: e.item.nftFileUrl,
                    mimetype: e.item.nftMimetype,
                  })
                }}
              />
            )}
            nestedScrollEnabled={true}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
        {activeAssetTab === 2 && (
          <FlatList
            data={collections}
            renderItem={(e) => (
              <RenderAssetItem
                item={e.item}
                onClick={() =>
                  navigation.navigate("NftItemHistory", {
                    item: e.item,
                    userWalletAddress: userWalletAddress,
                  })
                }
                onAssetPress={() => {
                  setMediaModalData({
                    open: true,
                    url: e.item.nftFileUrl,
                    mimetype: e.item.nftMimetype,
                  })
                }}
              />
            )}
            nestedScrollEnabled={true}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
        {activeAssetTab === 3 && (
          <FlatList
            data={documents}
            renderItem={(e) => (
              <DocumentListItem
                item={e.item}
                onAssetPress={() =>
                  setMediaModalData({
                    open: true,
                    mimetype: e.item.file.mimetype,
                    url: e.item.file.location,
                  })
                }
                onItemPress={() => {
                  navigation.navigate("DocumentHistoryScreen", {
                    item: e.item,
                    userWalletAddress: userWalletAddress,
                  })
                }}
              />
            )}
            nestedScrollEnabled={true}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
      <NftMediaModal
        modalVisible={mediaModalData.open}
        closeModal={() =>
          setMediaModalData((prev) => ({ ...prev, open: false }))
        }
        url={mediaModalData.url}
        mimetype={mediaModalData.mimetype}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  tokenIconStyle: {
    height: hp("3%"),
    width: hp("3%"),
  },

  mainContainerStyle: {
    backgroundColor: commonColors.primaryDarkColor,
    flex: 1,
  },
  tabText: {
    fontSize: hp("1.97%"),
    fontFamily: textStyles.boldFont,
  },
  coinsItemText: {
    fontFamily: textStyles.mediumFont,
    fontSize: hp("1.97%"),
    color: "#000000",
  },
})
