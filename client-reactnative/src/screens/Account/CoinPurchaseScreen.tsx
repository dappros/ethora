import React, { useEffect } from "react"
import { Image, Platform, StyleSheet, Text, View } from "react-native"

import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { coinImagePath, commonColors, textStyles } from "../../../docs/config"
import { Button } from "../../components/Button"
import SecondaryHeader from "../../components/SecondaryHeader/SecondaryHeader"
import { HStack } from "native-base"
import { requestPurchase, useIAP } from "react-native-iap"
import { useStores } from "../../stores/context"
import { httpPost } from "../../config/apiService"
import { showError, showSuccess } from "../../components/Toast/toast"

const productsList = [
  { name: "849 Coins", value: "0.99", id: "com.ethora.buy_1000" },
  { name: "8,491 Coins", value: "9.99", id: "com.ethora.buy_10000" },

  { name: "21,250 Coins", value: "24.99", id: "com.ethora.buy_25000" },

  { name: "42,500 Coins", value: "49.99", id: "com.ethora.buy_50000" },
  { name: "85,000 Coins", value: "99.99", id: "com.ethora.buy_100000" },
]

const BuyCoinsItem = ({
  balance,
  buttonTitle,
  onPress,
}: {
  balance: number | string
  buttonTitle: number | string
  onPress: () => void
}) => {
  return (
    <HStack justifyContent={"space-between"} style={{ paddingVertical: 10 }}>
      <HStack justifyContent={"center"}>
        <Image
          source={coinImagePath}
          style={{ height: hp("4%"), width: hp("4%") }}
        />

        <Text style={{ fontSize: hp("3%"), color: "black" }}>{balance}</Text>
      </HStack>
      <Button
        title={buttonTitle.toString()}
        style={styles.submitButton}
        onPress={onPress}
      />
    </HStack>
  )
}

export interface ICoinPurchaseScreen {}

const productIds = [
  "com.ethora.buy_1000",
  "com.ethora.buy_10000",
  "com.ethora.buy_25000",
  "com.ethora.buy_50000",
  "com.ethora.buy_100000",
]

const appleKey = "426b7e2459d74037962e34f57375dfe2"
export const CoinPurchaseScreen: React.FC<ICoinPurchaseScreen> = ({}) => {
  const { loginStore, walletStore } = useStores()
  const {
    connected,

    finishTransaction,
    getProducts,
  } = useIAP()
  const requestCoinPurchase = async (id: string) => {
    try {
      const transaction = await requestPurchase({ sku: id })
      if (transaction) {
        await finishTransaction({ purchase: transaction })
        const res = await httpPost(
          "/users/payments",
          {
            type: "purchase",
            transaction: transaction,
            platform: Platform.OS,
            password: Platform.OS === "ios" ? appleKey : "",
          },
          loginStore.userToken
        )
        await walletStore.fetchWalletBalance(loginStore.userToken, true)
        console.log(res.data)
        showSuccess("Succes", "Please, check your balance")
      }
    } catch (err) {
      showError("Error", "Please try again")
    }
  }

  useEffect(() => {
    if (connected) {
      getProducts({ skus: productIds })
    }
  }, [connected])
  return (
    <View>
      <SecondaryHeader title={"Buy Coins"} />
      <View style={{ paddingHorizontal: 16 }}>
        <HStack style={{ marginTop: 10 }}>
          <Text
            style={{
              color: "black",
              fontSize: 16,
              fontFamily: textStyles.regularFont,
            }}
          >
            <Text style={{ fontFamily: textStyles.boldFont }}>
              Here you can purchase Coins.{" \n"}
            </Text>
            Use Coins to unlock features such as create your own "meta rooms" or
            purchase NFTs. You may also use Coins to reward other users (use
            them as "likes" in response to useful chat messages etc).
          </Text>
        </HStack>

        <View style={{ marginTop: 20 }}>
          <Text
            style={{
              color: "black",
              fontFamily: textStyles.regularFont,
            }}
          >
            Please choose how many coins you would like to purchase now:
          </Text>
          {productsList.map((item) => (
            <BuyCoinsItem
              key={item.id}
              balance={item.name}
              buttonTitle={"$" + item.value}
              onPress={() => requestCoinPurchase(item.id)}
            />
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: commonColors.primaryDarkColor,
    padding: 5,
    // width: widthPercentageToDP("40%"),
    // height: hp("5.7%"),
    borderRadius: 20,
    fontFamily: textStyles.mediumFont,
    justifyContent: "center",
    alignItems: "center",
    color: "black",
    // marginTop: 10,
  },
})
