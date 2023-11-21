/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React, { useRef } from "react"
import { StyleSheet } from "react-native"
import QRCode from "react-native-qrcode-svg"
import Share from "react-native-share"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import { commonColors, textStyles, unv_url } from "../../docs/config"
import Clipboard from "@react-native-clipboard/clipboard"
import { useStores } from "../stores/context"
import { showToast } from "./Toast/toast"
import Ionicons from "react-native-vector-icons/Ionicons"
import { Pressable, Text, View } from "native-base"

interface QRCodeGeneratorProps {
  shareKey: string
  close: any
  removeBaseUrl?: boolean
}

const QRCodeGenerator = (props: QRCodeGeneratorProps) => {
  const svg: any = useRef(null)
  const { apiStore } = useStores()
  const { shareKey, close } = props

  let link = ""

  if (shareKey.includes("profileLink") || shareKey.includes("doclink")) {
    link = shareKey
  } else {
    link = shareKey.replace(apiStore.xmppDomains.CONFERENCEDOMAIN, "")
  }
  const createShareLink = () => {
    if (props.removeBaseUrl) {
      return shareKey
    }
    const shareLink = `${unv_url}${link}&app=ethora`
    return shareLink
  }

  const shareQR = () => {
    svg.current.toDataURL(callback)
  }

  const callback = (dataURL: string) => {
    const imgURL = `data:image/png;base64,${dataURL}`
    Share.open({ url: imgURL }).then(() => {
      close()
    })
  }

  const copyToClipboard = () => {
    if (props.removeBaseUrl) {
      Clipboard.setString(shareKey)
    } else {
      const shareLink = `${unv_url}${link}&app=ethora`
      Clipboard.setString(shareLink)
    }
    showToast("success", "Info", "Link copied", "top")
    // showInfo('Info', 'Link copied.')
  }

  const qrlink = createShareLink()

  return (
    <View style={styles.MainContainer}>
      <QRCode
        getRef={svg}
        //QR code value
        value={qrlink ? qrlink : undefined}
        //size of QR Code
        size={hp("20%")}
        //Color of the QR Code (Optional)
        color="black"
        quietZone={5}
        //Background Color of the QR Code (Optional)
        backgroundColor="white"
        //Logo of in the center of QR Code (Optional)
        // logo={logoPath}
        //Center Logo size  (Optional)
        logoSize={30}
        //Center Logo margin (Optional)
        logoMargin={1}
        //Center Logo radius (Optional)
        //Center Logo background (Optional)
        logoBackgroundColor="white"
      />

      <Pressable
        shadow={3}
        style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? "#1667e2"
              : commonColors.primaryDarkColor,
          },
        ]}
        height={wp("10%")}
        justifyContent="center"
        alignItems="center"
        bg={commonColors.primaryDarkColor}
        flexDirection="row"
        margin={5}
        marginBottom={2}
        borderRadius={5}
        onPress={shareQR}
        accessibilityLabel="Send your profile via QR"
        w={"80%"}
      >
        <Text style={styles.TextStyle}> Share QR </Text>
        <Ionicons size={hp("2%")} color={"#fff"} name="share-social" />
      </Pressable>

      <Text> Or copy link</Text>
      <Pressable
        shadow={2}
        height={wp("10%")}
        justifyContent="center"
        alignItems="center"
        bg={"#fff"}
        flexDirection="row"
        margin={5}
        marginTop={2}
        w={"80%"}
        borderRadius={5}
        accessibilityLabel="Copy hyperlink"
        onPress={copyToClipboard}
      >
        <View flex={0.8}>
          <Text
            color={"#000"}
            overflow={"hidden"}
            fontFamily={textStyles.mediumFont}
            numberOfLines={1}
          >
            {" "}
            {!props.removeBaseUrl && unv_url}
            {link}{" "}
          </Text>
        </View>

        <View
          flex={0.2}
          bg={commonColors.primaryDarkColor}
          w={wp("18%")}
          h={wp("9%")}
          borderRadius={5}
          justifyContent={"center"}
          alignItems={"center"}
          shadow={1}
          margin={1}
        >
          <Text color={"#fff"} fontFamily={textStyles.mediumFont}>
            Copy
          </Text>
        </View>
      </Pressable>
    </View>
  )
}

export default QRCodeGenerator

const styles = StyleSheet.create({
  MainContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "70%",
    paddingTop: 8,
    marginTop: 10,
    paddingBottom: 8,
    backgroundColor: commonColors.primaryDarkColor,
    marginBottom: 20,
    alignItems: "center",
    borderRadius: 5,
  },
  TextStyle: {
    color: "#fff",
    fontFamily: textStyles.mediumFont,
    // textAlign: 'center',
    fontSize: 18,
  },
})
