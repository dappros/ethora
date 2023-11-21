import { VStack, Input, View, Text } from "native-base"
import React, { useState } from "react"
import { ActivityIndicator, FlatList, StyleSheet } from "react-native"
import {
  commonColors,
  textStyles,
  itemsTransfersAllowed,
  coinsMainName,
} from "../../../../docs/config"
import { alpha } from "../../../helpers/aplha"
import { useStores } from "../../../stores/context"
import SendItem from "./SendItem"
import { CoinsTransferList } from "./CoinsTransferList"
import { TransferModalButton } from "./TransferModalButton"
import { showError } from "../../Toast/toast"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import { NftListItem } from "../../Transactions/NftListItem"
import { Seperator } from "../../Separator"
import { IDataForTransfer } from "../Chat/types"

export interface ITransferModal {
  dataForTransfer: IDataForTransfer
  closeModal: () => void
  hideUserActions: () => void
}

const emptySelectedItem = {
  contractAddress: "",
  nfmtType: "",
  tokenName: "",
  balance: 0,
  nftId: "",
  balances: [],
}

type TSelectedItem = typeof emptySelectedItem
export const TokensOrItemsTransfer: React.FC<ITransferModal> = ({
  dataForTransfer,
  closeModal,
  hideUserActions,
}) => {
  const { walletStore, loginStore } = useStores()
  const [selectedItem, setSelectedItem] =
    useState<TSelectedItem>(emptySelectedItem)
  const [allowedEnterCustomAmount, setAllowedEnterCustomAmount] =
    useState(false)
  const [customTransferAmount, setCustomTransferAmount] = useState("")
  const [displayItems, setDisplayItems] = useState(false)
  const [displayCollections, setDisplayCollections] = useState(false)
  const [loading, setLoading] = useState(false)
  const transferTokens = async (tokenAmount: number) => {
    if (tokenAmount <= 0) {
      showError("Error", "Amount must be greater than 0")
      return
    }
    if (!walletStore.coinBalance || +tokenAmount > +walletStore.coinBalance) {
      showError("Error", "Not enough tokens")
      return
    }

    const receiverName = dataForTransfer.name
    const receiverMessageId = dataForTransfer.message_id
    const senderName = dataForTransfer.senderName
    const fromWalletAddress = loginStore.initialData.walletAddress
    const walletAddress = dataForTransfer.walletFromJid

    const bodyData = {
      toWallet: walletAddress,
      amount: tokenAmount,
      tokenId: "ERC20",
      tokenName: coinsMainName,
    }

    await walletStore.transferTokens(
      bodyData,
      loginStore.userToken,
      fromWalletAddress,
      senderName,
      receiverName,
      receiverMessageId,
      false
    )
    closeModal()
  }

  const transferItems = async () => {
    if (!selectedItem?.balance) {
      showError("error", "Not enough tokens")
    }
    const receiverName = dataForTransfer.name
    const senderName = dataForTransfer.senderName
    const fromWalletAddress = loginStore.initialData.walletAddress
    const walletAddress = dataForTransfer.walletFromJid

    const bodyData = {
      nftId: selectedItem.nftId,
      receiverWallet: walletAddress,
      amount: 1,
      tokenName: selectedItem.tokenName,
    }

    const nfmtBodyData = {
      to: walletAddress,
      id: selectedItem.nfmtType,
      amount: 1,
      contractAddress: selectedItem?.contractAddress,
      isNfmt: true,
      tokenName: selectedItem.tokenName,
      nftId: selectedItem.nftId,
    }

    await walletStore.transferTokens(
      selectedItem?.balances?.length ? nfmtBodyData : bodyData,
      loginStore.userToken,
      fromWalletAddress,
      senderName,
      receiverName,
      null,
      true
    )
    closeModal()

    setDisplayItems(false)
    setSelectedItem(emptySelectedItem)
  }

  const transferCollection = async () => {
    setLoading(true)
    const receiverName = dataForTransfer.name
    const senderName = dataForTransfer.senderName
    const receiverWalletAddress = dataForTransfer.walletFromJid

    const bodyData = {
      toAddress: receiverWalletAddress,
      contractAddress: selectedItem?.contractAddress,
    }
    await walletStore.transferCollection(
      bodyData,
      senderName,
      receiverName,
      selectedItem.tokenName + " (Collection)"
    )
    setLoading(false)
    closeModal()

    setDisplayItems(false)
    setDisplayCollections(false)
    setSelectedItem(emptySelectedItem)
  }
  const onCustomAmountPress = () => {
    setAllowedEnterCustomAmount(true)
    hideUserActions()
  }
  const onSendItemsPress = () => {
    setDisplayItems(true)
    hideUserActions()
  }
  const onSendCollectionsPress = () => {
    setDisplayCollections(true)
    hideUserActions()
  }
  const renderItems = () => {
    const getItemSelected = (pressedItem: TSelectedItem, item: any) => {
      if (item.tokenType === "NFMT") {
        return (
          pressedItem.nfmtType + pressedItem.contractAddress ===
          item.nfmtType + item.contractAddress
        )
      }
      return pressedItem.contractAddress === item.contractAddress
    }
    return (
      <FlatList
        data={
          displayItems
            ? walletStore.nftItems.filter((item: any) => !item.external)
            : walletStore.collections
        }
        renderItem={({ item }: any) => (
          <NftListItem
            assetUrl={item.imagePreview || item.nftFileUrl}
            name={item.tokenName}
            assetsYouHave={item.balance.toString()}
            totalAssets={item.total}
            onClick={() => setSelectedItem(item)}
            itemSelected={getItemSelected(selectedItem, item)}
            nftId={item.nftId}
            mimetype={item.nftMimetype}
            traitsEnabled={false}
            item={item}
          />
        )}
        nestedScrollEnabled={true}
        keyExtractor={(item, index) => index.toString()}
      />
    )
  }

  if (displayItems) {
    return (
      <View style={styles.itemsContainer}>
        <View style={[styles.tokenTransferContainer]}>
          {renderItems()}

          {<SendItem title={"Send Items"} onPress={transferItems} />}
        </View>
      </View>
    )
  }

  if (displayCollections) {
    return (
      <View style={styles.collectionsContainer}>
        <View style={styles.tokenTransferContainer}>
          {renderItems()}

          {!loading ? (
            <SendItem title={"Send Collections"} onPress={transferCollection} />
          ) : (
            <ActivityIndicator size={30} />
          )}
        </View>
      </View>
    )
  }

  return (
    <View
      w={wp("70%")}
      bg={"#ffff"}
      justifyContent={"center"}
      alignItems={"center"}
      borderRadius={10}
      padding={2}
    >
      {allowedEnterCustomAmount ? (
        <VStack>
          <Text style={styles.enterAmountText}>Enter Your Amount</Text>
          <View style={{ paddingHorizontal: 5, marginVertical: 10 }}>
            <Input
              maxLength={15}
              keyboardType="numeric"
              fontFamily={textStyles.lightFont}
              fontSize={hp("1.6%")}
              color={"black"}
              accessibilityLabel={"Enter transfer amount"}
              value={customTransferAmount}
              onChangeText={setCustomTransferAmount}
              placeholder="Enter transfer amount"
              placeholderTextColor={commonColors.primaryDarkColor}
              borderColor={commonColors.primaryDarkColor}
              backgroundColor={alpha(commonColors.primaryDarkColor, 0.1)}
            />
          </View>
          <TransferModalButton
            title={"Send"}
            onPress={() => transferTokens(parseInt(customTransferAmount))}
          />
        </VStack>
      ) : (
        <>
          <View style={styles.tokenTransferContainer}>
            <CoinsTransferList
              name={dataForTransfer.name}
              onTokenTransferPress={transferTokens}
              onCustomAmountPress={onCustomAmountPress}
            />
          </View>

          {walletStore.nftItems.filter((item: any) => !item.external).length >
            0 &&
            itemsTransfersAllowed && (
              <>
                <Seperator />

                <SendItem title={"Send Items"} onPress={onSendItemsPress} />
              </>
            )}
          {!!walletStore.collections.length && (
            <>
              <Seperator />

              <SendItem
                title={"Send Collections"}
                onPress={onSendCollectionsPress}
              />
            </>
          )}
          <Seperator />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemsContainer: {
    backgroundColor: "white",
    height: hp("40%"),
    width: wp("90%"),
    padding: 0,
    margin: 0,
    paddingTop: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  collectionsContainer: {
    backgroundColor: "white",
    height: hp("50%"),
    width: wp("100%"),
    padding: 0,
    margin: 0,
    paddingTop: 7,
    justifyContent: "center",
    alignItems: "center",
  },

  enterAmountText: {
    color: commonColors.primaryColor,
    fontFamily: textStyles.semiBoldFont,
    textAlign: "center",
  },
  privacyPolicyMainContainer: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    height: hp("70%"),
    width: wp("80%"),
  },

  tokenTransferContainer: {
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
})
