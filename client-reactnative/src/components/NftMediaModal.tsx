/*
Copyright 2019-2023 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React from "react"
import { View, TouchableOpacity, StyleSheet } from "react-native"

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import Modal from "react-native-modal"
import { pdfMimemtype } from "../constants/mimeTypes"
import AudioPlayer from "../components/AudioPlayer/AudioPlayer"
import VideoPlayer from "react-native-video-player"
import { commonColors, textStyles } from "../../docs/config"
import FastImage from "react-native-fast-image"
import { PdfViewer } from "./PdfViewer"
import EntypoIcons from "react-native-vector-icons/Entypo"
import AntDesignIcons from "react-native-vector-icons/AntDesign"
import {
  isAudioMimetype,
  isImageMimetype,
  isVideoMimetype,
} from "../helpers/checkMimetypes"

export const NftMediaModal = ({
  closeModal,
  mimetype,
  url,
  modalVisible,
  sharable,
  onSharePress,
}: {
  closeModal: () => void
  mimetype: string
  url: string
  modalVisible: boolean
  sharable?: boolean
  onSharePress?: () => void
}) => {
  return (
    <Modal onBackdropPress={closeModal} isVisible={modalVisible}>
      {sharable && (
        <TouchableOpacity
          style={{ position: "absolute", top: 20, right: 0, zIndex: 999999 }}
          onPress={onSharePress}
        >
          <EntypoIcons name="share" color={"white"} size={25} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={{ position: "absolute", top: 20, left: 0, zIndex: 999999 }}
        onPress={closeModal}
      >
        <AntDesignIcons name="close" color={"white"} size={25} />
      </TouchableOpacity>
      <View style={classes.modal}>
        <View style={{ position: "absolute", height: hp("80%") }}>
          {pdfMimemtype[mimetype] && <PdfViewer uri={url} />}
        </View>

        {isAudioMimetype(mimetype) && (
          <View style={{ position: "absolute", top: "50%" }}>
            <AudioPlayer audioUrl={url} />
          </View>
        )}
        {isImageMimetype(mimetype) && (
          <TouchableOpacity onPress={closeModal}>
            <FastImage
              style={{
                width: wp("90%"),
                height: hp("90%"),
              }}
              source={{
                uri: url,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </TouchableOpacity>
        )}

        {isVideoMimetype(mimetype) && (
          <TouchableOpacity
            // onPress={() => setVideoPaused(prev => !prev)}
            activeOpacity={1}
            style={{ height: hp("100%"), width: "100%" }}
          >
            <VideoPlayer
              video={{
                uri: url,
              }}
              autoplay
              videoWidth={wp("100%")}
              videoHeight={hp("100%")}
              // thumbnail={{uri: 'https://i.picsum.photos/id/866/1600/900.jpg'}}
            />
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  )
}

const classes = StyleSheet.create({
  tokenIconStyle: {
    height: hp("3%"),
    width: hp("3%"),
  },
  justifyBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  tokenImage: {
    width: wp("60%"),
    height: wp("40%"),
    borderRadius: 5,
  },
  alignCenter: {
    justifyContent: "center",
    alignItems: "center",
  },

  textStyle: {
    fontFamily: textStyles.lightFont,
    color: "black",
    // position: 'absolute',
  },
  itemNameInput: {
    color: "black",
    borderWidth: 1,
    borderColor: commonColors.primaryColor,
    borderRadius: 5,
    flex: 1,
    // backgroundColor:primaryColor,
    paddingLeft: 20,
    alignItems: "flex-start",
    height: wp("10%"),
    fontFamily: textStyles.lightFont,
    fontSize: hp("1.8%"),
  },
  checkboxContainer: {
    flexDirection: "row",
    width: wp("80%"),
    alignItems: "center",
    marginTop: 10,
  },
  rarityItems: {
    paddingLeft: 5,
    paddingVertical: 5,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  imageContainer: {
    width: wp("60%"),
    height: wp("40%"),
    borderRadius: 10,
    borderWidth: 1,
    marginRight: wp("5%"),
    marginLeft: wp("7%"),
    borderColor: "lightgrey",
  },
  notFoundImageText: {
    marginTop: "auto",
    fontFamily: textStyles.lightFont,
    fontSize: hp("2.6%"),
    color: commonColors.primaryColor,
  },
  tokenDescriptionContainer: {
    borderRadius: 5,
    marginLeft: 10,
    // flexDirection: 'row',
    alignItems: "flex-start",
    justifyContent: "space-around",
    width: wp("40%"),
    // height: wp('10%'),
    paddingRight: 10,
  },
  noTransactionsImage: {
    marginTop: 20,
    resizeMode: "stretch",
    height: hp("21.50%"),
    width: wp("47.69%"),
  },
  modal: {
    // backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: wp("90%"),
    height: wp("90%"),
    position: "relative",
  },
  modalImage: {
    width: wp("90%"),
    height: wp("90%"),
    borderRadius: 10,
  },
})
