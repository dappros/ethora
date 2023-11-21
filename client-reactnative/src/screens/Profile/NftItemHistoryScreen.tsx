import React, { Fragment, useEffect, useState } from "react"
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native"
import { HStack, Image, ScrollView, Text, View, VStack } from "native-base"
import SecondaryHeader from "../../components/SecondaryHeader/SecondaryHeader"
import AntIcon from "react-native-vector-icons/AntDesign"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import FastImage from "react-native-fast-image"
import Modal from "react-native-modal"
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer"
import NftTransactionListTab from "../../components/Nft/NftTransactionList"
import { useStores } from "../../stores/context"
import { transactionURL } from "../../config/routesConstants"
import { httpGet, httpPost } from "../../config/apiService"
import { APP_TOKEN, commonColors, textStyles } from "../../../docs/config"
import VideoPlayer from "react-native-video-player"
import { mapTransactions } from "../../stores/walletStore"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { DeleteDialog } from "../../components/Modals/DeleteDialog"
import { useNavigation } from "@react-navigation/native"
import { showError, showSuccess } from "../../components/Toast/toast"
import {
  isAudioMimetype,
  isImageMimetype,
  isVideoMimetype,
} from "../../helpers/checkMimetypes"
import { HomeStackNavigationProp } from "../../navigation/types"

const NftItemHistoryScreen = (props: any) => {
  const { item, userWalletAddress } = props.route.params

  const { loginStore, walletStore } = useStores()

  const [filePreview, setFilePreview] = useState<{ uri: string }>({
    uri: "",
  })
  const [itemTransactions, setItemTransactions] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [videoPaused, setVideoPaused] = useState<boolean>(true)
  const navigation = useNavigation<HomeStackNavigationProp>()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [modalData, setModalData] = useState({
    visible: false,
    url: "",
    mimetype: "",
  })

  useEffect(() => {
    setFilePreview({ uri: item.nftFileUrl })
    getItemTransactionsHistory(userWalletAddress, item.nftId).then((res) => {
      const allTransactions = res.data.items.map((transation) => {
        return mapTransactions(transation, userWalletAddress)
      })

      setItemTransactions(
        allTransactions.sort((a: any, b: any) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        })
      )
    })
    return () => {}
  }, [item])

  //function to get Item transactions
  const getItemTransactionsHistory = async (
    walletAddress: string,
    nftId: string
  ) => {
    const url =
      transactionURL + "walletAddress=" + walletAddress + "&" + "nftId=" + nftId

    const appToken = APP_TOKEN
    return await httpGet(url, appToken)
  }

  const onPreviewClick = () => {
    setModalData({
      url: item.nftFileUrl,
      mimetype: item.nftMimetype,
      visible: true,
    })
  }

  const closeModal = () => {
    setModalData((prev) => ({ ...prev, visible: false, url: "" }))
  }
  const deleteItem = async () => {
    setLoading(true)
    try {
      if (item?.isCollection) {
        await httpPost(
          "/tokens/items/nfmt/collection-destroy/" + item.contractAddress,
          {},
          loginStore.userToken
        )
      }

      if (item.tokenType === "NFMT") {
        await httpPost(
          "/tokens/items/nfmt/burn/" +
            item.contractAddress +
            "/" +
            item.nfmtType,
          { amount: item.balance },
          loginStore.userToken
        )
      }
      if (item.tokenType === "NFT") {
      }
      await walletStore.fetchWalletBalance(loginStore.userToken, true)
      navigation.navigate("ProfileScreen")
      showSuccess("Success", "Item deleted")
    } catch (error) {
      showError(
        "Error",
        "Cant burn this collection as someone already owns NFTs in it"
      )
    }
    setLoading(false)
  }

  return (
    <Fragment>
      <SecondaryHeader
        title={item.isCollection ? "Collection details" : "Item details"}
      />

      <ScrollView style={styles.container}>
        <View style={{ ...styles.contentContainer, margin: 0 }}>
          <View style={styles.justifyBetween}>
            <TouchableOpacity
              onPress={onPreviewClick}
              style={{ alignItems: "center", width: wp("60%") }}
            >
              <View style={[styles.alignCenter, styles.imageContainer]}>
                {isImageMimetype(item.nftMimetype) && (
                  <FastImage
                    style={styles.tokenImage}
                    source={{
                      uri: filePreview?.uri,
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                )}
                {isVideoMimetype(item.nftMimetype) && (
                  <View style={{ position: "relative" }}>
                    <View style={styles.videoPlayButton}>
                      <AntIcon
                        name={"playcircleo"}
                        color={"white"}
                        size={hp("5%")}
                      />
                    </View>

                    <FastImage
                      style={styles.tokenImage}
                      source={{
                        uri: filePreview?.uri,
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  </View>
                )}
                {isAudioMimetype(item.nftMimetype) && (
                  <AntIcon
                    name={"playcircleo"}
                    color={commonColors.primaryColor}
                    size={hp("10%")}
                  />
                )}
              </View>
            </TouchableOpacity>
            <View style={styles.tokenDescriptionContainer}>
              <Text
                style={[
                  styles.textStyle,
                  {
                    wordWrap: "wrap",
                    fontWeight: "bold",
                  },
                ]}
              >
                {item.tokenName}
              </Text>
              <Text
                style={[
                  styles.textStyle,
                  {
                    marginTop: 10,
                    alignSelf: "flex-start",
                  },
                ]}
              >
                Balance: {item.balance + "/" + item.total}
              </Text>

              <View />
              {loginStore.initialData.walletAddress === userWalletAddress && (
                <HStack w={"full"} justifyContent={"center"} mt={5}>
                  <TouchableOpacity
                    onPress={() => setDeleteModalOpen(true)}
                    style={styles.actionButton}
                  >
                    <MaterialIcons name="delete" size={35} color={"red"} />
                  </TouchableOpacity>
                </HStack>
              )}
            </View>
          </View>

          <TouchableOpacity
            disabled={loading}
            // onPress={onMintClick}
            style={[styles.createButton, { height: hp("5%"), borderRadius: 0 }]}
          >
            <VStack justifyContent={"center"} alignItems={"center"} flex={1}>
              {loading ? (
                <ActivityIndicator
                  animating={loading}
                  size="small"
                  color={"white"}
                />
              ) : (
                <Text style={styles.createButtonText}>Provenance</Text>
              )}
            </VStack>
          </TouchableOpacity>
          <View style={{ height: hp("50%") }}>
            {itemTransactions.length ? (
              <NftTransactionListTab
                onEndReached={() => {}}
                transactions={itemTransactions}
                walletAddress={userWalletAddress}
              />
            ) : (
              <VStack justifyContent={"center"} alignItems={"center"} mt={"2"}>
                <Text
                  style={[
                    styles.textStyle,
                    {
                      fontWeight: "bold",
                      color: commonColors.primaryColor,
                    },
                  ]}
                >
                  This item has no transactions yet...
                </Text>
                <Image
                  alt={"no transaction"}
                  source={require("../../assets/transactions-empty.png")}
                  style={styles.noTransactionsImage}
                />
              </VStack>
            )}
          </View>
        </View>
      </ScrollView>
      <Modal onBackdropPress={closeModal} isVisible={modalData.visible}>
        <View style={styles.modal}>
          {isAudioMimetype(modalData.mimetype) && (
            <View style={{ position: "absolute", top: "50%" }}>
              <AudioPlayer audioUrl={modalData.url} />
            </View>
          )}
          {isImageMimetype(modalData.mimetype) && (
            <TouchableOpacity onPress={closeModal}>
              <Image
                alt="modal image"
                source={filePreview}
                style={styles.modalImage}
              />
            </TouchableOpacity>
          )}

          {isVideoMimetype(modalData.mimetype) && (
            <TouchableOpacity
              onPress={() => setVideoPaused((prev) => !prev)}
              activeOpacity={1}
              style={{ height: hp("100%"), width: "100%" }}
            >
              <VideoPlayer
                video={{
                  uri: modalData.url,
                }}
                autoplay
                videoWidth={wp("100%")}
                videoHeight={hp("100%")}
              />
            </TouchableOpacity>
          )}
        </View>
      </Modal>
      <DeleteDialog
        loading={loading}
        onDeletePress={deleteItem}
        title={
          item.isCollection
            ? "Do you really want to delete \n(burn) this NFT Collection?"
            : "Do you really want to delete \n(burn) this NFT?"
        }
        description={"You will not be able to undo this."}
        onClose={() => setDeleteModalOpen(false)}
        open={deleteModalOpen}
        deleteButtonTitle={"Yes, burn 🔥"}
        cancelButtonTitle={"No, cancel ✖️"}
      />
    </Fragment>
  )
}

export default NftItemHistoryScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  videoPlayButton: {
    position: "absolute",
    zIndex: 99999,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    width: wp("60%"),
    height: wp("40%"),
  },
  contentContainer: {
    flex: 1,
    margin: 20,
    marginTop: 0,
  },
  actionButton: {
    marginBottom: 5,
  },
  tokenImage: {
    width: wp("60%"),
    height: wp("40%"),
    borderRadius: 5,
  },
  justifyBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  alignCenter: {
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
  textStyle: {
    fontFamily: textStyles.lightFont,
    color: "black",
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
  },
  modalImage: {
    width: wp("90%"),
    height: wp("90%"),
    borderRadius: 10,
  },
  createButtonText: {
    fontSize: hp("2%"),
    color: "#fff",
    fontFamily: textStyles.regularFont,
  },
  createButton: {
    backgroundColor: commonColors.primaryColor,
    borderRadius: 5,
    height: hp("7%"),
    marginTop: 20,
  },
})
