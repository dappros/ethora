import React, { useState } from "react"
import {
  Text,
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native"
import QRCodeScanner from "react-native-qrcode-scanner"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"

import { useNavigation } from "@react-navigation/native"
import { launchImageLibrary } from "react-native-image-picker"
import { PNG } from "pngjs/browser"
import JpegDecoder from "jpeg-js"
import jsQR from "jsqr"
import { appLinkingUrl, commonColors, textStyles } from "../../../docs/config"
import SecondaryHeader from "../../components/SecondaryHeader/SecondaryHeader"
import { showToast } from "../../components/Toast/toast"
import parseLink from "../../helpers/parseLink"
import { underscoreManipulation } from "../../helpers/underscoreLogic"
import { useStores } from "../../stores/context"
import { retrieveOtherUserVcard, subscribeToRoom } from "../../xmpp/stanzas"
import { HomeStackNavigationProp } from "../../navigation/types"
import { ImageLibraryOptions } from "react-native-image-picker"

declare let global: any
const Buffer = require("buffer").Buffer
global.Buffer = Buffer // very important

//interface and types
const options: ImageLibraryOptions = {
  mediaType: "photo",
  includeBase64: true,
  maxHeight: 200,
  maxWidth: 200,
}
//interface and types

//handle decode data from a qr image
function createImageData(base64ImageData: any, imageType: string) {
  let decodedData: any = {}
  const bufferFrom = Buffer.from(base64ImageData, "base64")
  if (imageType === "image/jpeg") {
    decodedData = JpegDecoder.decode(bufferFrom, { useTArray: true })
  } else if (imageType === "image/png") {
    decodedData = PNG.sync.read(bufferFrom)
  }
  return jsQR(
    Uint8ClampedArray.from(decodedData.data),
    decodedData.width,
    decodedData.height
  )
}

const ScanScreen = () => {
  //mobx stores
  const { loginStore, chatStore, apiStore } = useStores()
  //mobx stores

  //local states
  const [isLoading, setIsLoading] = useState(false)
  //local states

  //local variables
  const manipulatedWalletAddress = underscoreManipulation(
    loginStore.initialData.walletAddress
  )
  const username = loginStore.initialData.username
  //local variables

  //navigator
  const navigation = useNavigation<HomeStackNavigationProp>()
  //navigator

  //handle to subscribe and open chat room from given QR code image
  const onSuccess = (e: any) => {
    if (!e) {
      showToast("error", "Error", "Invalid QR", "top")
      setIsLoading(false)
      return
    }
    if (e.data.includes("profileLink")) {
      const params = e.data.split("https://www.eto.li/go")[1]
      const queryParams = new URLSearchParams(params)
      const firstName: string = queryParams.get("firstName") as string
      const lastName: string = queryParams.get("lastName") as string
      const xmppId: string = queryParams.get("xmppId") as string
      const walletAddressFromLink: string = queryParams.get(
        "walletAddress"
      ) as string

      if (loginStore.initialData.walletAddress === walletAddressFromLink) {
        navigation.navigate("ProfileScreen")
      } else {
        retrieveOtherUserVcard(
          loginStore.initialData.xmppUsername,
          xmppId,
          chatStore.xmpp
        )

        loginStore.setOtherUserDetails({
          anotherUserFirstname: firstName,
          anotherUserLastname: lastName,
          anotherUserLastSeen: {},
          anotherUserWalletAddress: walletAddressFromLink,
        })
        navigation.navigate("OtherUserProfileScreen", {
          walletAddress: walletAddressFromLink,
        })
      }
    } else {
      if (e) {
        const parsedLink = parseLink(e.data)

        if (parsedLink) {
          const chatId = parsedLink.searchParams.get("c")
          subscribeToRoom(
            chatId + apiStore.xmppDomains.CONFERENCEDOMAIN,
            manipulatedWalletAddress,
            chatStore.xmpp
          )
          setIsLoading(false)
          navigation.navigate("ChatScreen", {
            chatJid: chatId + apiStore.xmppDomains.CONFERENCEDOMAIN,
          })
        } else {
          showToast("error", "Error", "Invalid QR", "top")
          setIsLoading(false)
        }
      } else {
        showToast("error", "Error", "Invalid QR", "top")
        setIsLoading(false)
      }
    }
  }

  //launch image gallery
  const openGallery = () => {
    setIsLoading(true)
    launchImageLibrary(options, async (response: any) => {
      if (response.didCancel) {
        setIsLoading(false)
        console.log("User cancelled image picker")
      } else if (response.error) {
        setIsLoading(false)
        console.log("ImagePicker Error: ", response.error)
      } else if (response.customButton) {
        setIsLoading(false)
        console.log("User tapped custom button: ", response.customButton)
      } else {
        const res = createImageData(
          response.assets[0].base64,
          response.assets[0].type
        )
        console.log(JSON.stringify(res))
        onSuccess(res)
      }
    })
  }

  return (
    <View style={styles.container}>
      <View style={{ zIndex: Platform.OS === "android" ? +1 : 0, flex: 0.2 }}>
        <SecondaryHeader title="Scan" />
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color={"black"} animating={isLoading} />
      ) : (
        <QRCodeScanner
          showMarker={true}
          topViewStyle={{ flex: 0 }}
          containerStyle={{ flex: 1 }}
          cameraStyle={{
            flex: Platform.OS === "android" ? 0.8 : 1,
            height: hp("40%"),
            width: "100%",
            justifyContent: "flex-start",
          }}
          bottomViewStyle={{ flex: 1 }}
          onRead={(e) => onSuccess(e)}
          bottomContent={
            <TouchableOpacity
              onPress={openGallery}
              style={styles.buttonTouchable}
            >
              <Text style={styles.buttonTextStyle}>Upload from gallery.</Text>
            </TouchableOpacity>
          }
        />
      )}
    </View>
  )
}

export default ScanScreen

//styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonTouchable: {
    fontSize: 21,
    backgroundColor: commonColors.primaryColor,
    marginTop: 32,
    borderRadius: 5,
    width: wp("53.33%"),
    justifyContent: "center",
    alignItems: "center",
    height: hp("6.03%"),
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    fontFamily: textStyles.regularFont,
  },
})
//styles
