/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { Box, HStack, Image, Modal, VStack } from "native-base"
import React, { useEffect, useState } from "react"
import { widthPercentageToDP } from "react-native-responsive-screen"
import { pdfMimemtype, TCombinedMimeType } from "../../constants/mimeTypes"
import VideoPlayer from "react-native-video-player"
import {
  TouchableOpacity,
  Dimensions,
  Text,
  View,
  ActivityIndicator,
} from "react-native"
import { widthPercentageToDP as wp } from "react-native-responsive-screen"

import AntDesignIcons from "react-native-vector-icons/AntDesign"
import FastImage from "react-native-fast-image"
import { coinImagePath, textStyles } from "../../../docs/config"
import { observer } from "mobx-react-lite"
import { useStores } from "../../stores/context"
import { botTypes } from "../../constants/botTypes"
import { botStanza } from "../../xmpp/stanzas"
import { underscoreManipulation } from "../../helpers/underscoreLogic"
import { httpGet } from "../../config/apiService"
import { downloadFile } from "../../helpers/downloadFile"
import { weiToNormalUnits } from "../../helpers/weiToNormalUnits"
import { PdfViewer } from "../PdfViewer"
import { formatBigNumber } from "../../helpers/formatBigNumber"
import { isImageMimetype, isVideoMimetype } from "../../helpers/checkMimetypes"
const { width, height: windowHeight } = Dimensions.get("window")

//interfaces
interface IChatMediaModal {
  open: boolean
  url: string | undefined
  type: TCombinedMimeType
  onClose: () => void
  messageData: any
}
//interfaces

//common action button
const ModalActionButton = ({
  actionTypeText,
  cost,
  action,
}: {
  actionTypeText: string
  cost: string | number
  action: () => void
}) => {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={action}>
      <VStack
        bgColor={"white"}
        borderRadius={"md"}
        alignItems={"center"}
        justifyContent={"center"}
        width={"full"}
      >
        <Text
          style={{
            color: "black",
            fontFamily: textStyles.mediumFont,
            fontSize: 18,
          }}
        >
          {actionTypeText}
        </Text>
        <HStack justifyContent={"center"} alignItems={"center"}>
          <Text
            style={{
              color: "black",
              fontFamily: textStyles.mediumFont,
              fontSize: 20,
              marginBottom: -3,
            }}
          >
            {cost}
          </Text>
          <Image
            alt="coin"
            resizeMode="contain"
            source={coinImagePath}
            style={{ width: 25, height: 25, marginRight: 3 }}
          />
        </HStack>
      </VStack>
    </TouchableOpacity>
  )
}

export const ChatMediaModal: React.FC<IChatMediaModal> = observer(
  ({ open, url, type, onClose, messageData }) => {
    //Mobx stores
    const { chatStore, loginStore, apiStore } = useStores()
    //Mobx stores

    //local states
    const [height, setHeight] = useState(0)
    const [buttonState, setButtonState] = useState({
      title: "Wrap",
      cost: "100",
    })
    const [loading, setLoading] = useState(false)
    //local states

    //hooks
    useEffect(() => {
      if (messageData) {
        getButtonState()
      }
    }, [messageData])
    //hooks

    //get the cost of NFT attachment
    const getCosts = async () => {
      try {
        const res = await httpGet(
          "/tokens/get/" + messageData?.contractAddress,
          apiStore.defaultToken
        )
        return res.data
      } catch (error) {
        console.log(error)
        return []
      }
    }

    //to set action button state
    const getButtonState = async () => {
      console.log("get button")
      if (messageData?.attachmentId && !messageData?.nftId) {
        setButtonState({ title: "Wrap", cost: "100" })

        return "Wrap"
      }
      if (messageData?.nftId && messageData?.contractAddress) {
        const res = await getCosts()
        const costs = res?.results?.costs
        setButtonState({
          title: "Get",
          cost: `${Math.min(...costs)} - ${formatBigNumber(
            weiToNormalUnits(Math.max(...costs))
          )}`,
        })
      } else {
        return ""
      }
    }

    //handle to download media
    const downloadMedia = async () => {
      setLoading(true)
      await downloadFile(messageData?.image, messageData?.originalName)
      setLoading(false)
    }

    //UI for the content inside modal
    const renderModalContent = () => {
      if (isImageMimetype(type)) {
        const modalButtonAction = () => {
          const manipulatedWalletAddress = underscoreManipulation(
            loginStore.initialData.walletAddress
          )
          const data = {
            attachmentId: messageData.attachmentId,
            botType: messageData?.contractAddress
              ? botTypes.mintBot
              : botTypes.deployBot,
            contractAddress: messageData?.contractAddress,
            senderFirstName: loginStore.initialData.firstName,
            senderLastName: loginStore.initialData.lastName,
          }
          botStanza(
            manipulatedWalletAddress,
            messageData.roomJid,
            data,
            chatStore.xmpp
          )
          onClose()
        }

        return (
          <View>
            <FastImage
              accessibilityLabel="Image Attachment"
              style={{
                width: "100%",
                height:
                  height > windowHeight - 50 ? windowHeight - 120 : height,
              }}
              source={{
                uri: url,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
              onLoad={(evt) =>
                setHeight(
                  (evt.nativeEvent.height / evt.nativeEvent.width) * width // By this, you keep the image ratio
                )
              }
            />
            {!!messageData.attachmentId && (
              <ModalActionButton
                action={modalButtonAction}
                actionTypeText={buttonState.title}
                cost={buttonState.cost}
              />
            )}
          </View>
        )
      }
      if (isVideoMimetype(type)) {
        return (
          <TouchableOpacity
            activeOpacity={1}
            accessibilityLabel={"Video Attachment"}
            style={{ height: height, width: "100%" }}
          >
            <VideoPlayer
              video={{
                uri: url,
              }}
              autoplay
              videoWidth={wp("100%")}
              videoHeight={height}
              onLoad={(e) =>
                setHeight(
                  (e.naturalSize.height / e.naturalSize.width) * width // By this, you keep the image ratio
                )
              }
            />
          </TouchableOpacity>
        )
      }
      if (pdfMimemtype[type]) {
        return url && <PdfViewer uri={url} />
      }
      return null
    }

    return (
      <Modal
        isOpen={open}
        onClose={onClose}
        _backdrop={{
          bg: "black",
        }}
      >
        <Box w={widthPercentageToDP("80%")}>
          <TouchableOpacity
            style={{ position: "absolute", right: 0, top: -30, zIndex: 9999 }}
            onPress={onClose}
          >
            <AntDesignIcons name="close" size={30} color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ position: "absolute", left: 0, top: -30, zIndex: 9999 }}
            onPress={downloadMedia}
          >
            {loading ? (
              <ActivityIndicator color={"white"} size={30} />
            ) : (
              <AntDesignIcons name="download" size={30} color={"white"} />
            )}
          </TouchableOpacity>
          {renderModalContent()}
        </Box>
      </Modal>
    )
  }
)
