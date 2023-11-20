import React, { Fragment, useState } from "react"
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native"
import SecondaryHeader from "../../components/SecondaryHeader/SecondaryHeader"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import { commonColors, textStyles } from "../../../docs/config"
import AntIcon from "react-native-vector-icons/AntDesign"
import FastImage from "react-native-fast-image"
import DocumentPicker from "react-native-document-picker"
import { uploadFiles } from "../../helpers/uploadFiles"
import { useStores } from "../../stores/context"
import { showError } from "../../components/Toast/toast"
import { useNavigation } from "@react-navigation/native"
import { httpPost } from "../../config/apiService"
import { fileUpload, nftTransferURL } from "../../config/routesConstants"
import CheckBox from "@react-native-community/checkbox"
import Modal from "react-native-modal"
import { isAudioMimetype } from "../../helpers/checkMimetypes"
import { HStack, VStack } from "native-base"
import { HomeStackNavigationProp } from "../../navigation/types"

const selectOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const MintScreen = () => {
  //mobx stores
  const { loginStore, walletStore } = useStores()
  //mobx stores

  //navigator
  const navigation = useNavigation<HomeStackNavigationProp>()
  //navigator

  //local states
  const [itemName, setItemName] = useState<string>("")
  const [nftFileUrl, setNftFileUrl] = useState<string>("")
  const [filePickResult, setFilePickResult] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedValue, setSelectedValue] = useState<number>(1)
  const [fileId, setFileId] = useState<any>("")
  const [isModalVisible, setModalVisible] = useState<boolean>(false)
  const [distributionRightsApproved, setDistributionRightsApproved] =
    useState<boolean>(true)
  //local states

  //handle to display or hide modal
  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  }

  //handle to clear all data
  const clearData = () => {
    setLoading(false)
    setNftFileUrl("")
    setItemName("")
    setDistributionRightsApproved(false)
  }

  //handle to set the quantity of nft to mint
  const selectNftQuantity = (value: number) => {
    setSelectedValue(value)
    setModalVisible(false)
  }

  //handle to create an Nft item
  const createNftItem = async () => {
    const item = { name: itemName, rarity: selectedValue, mediaId: fileId }
    const url = nftTransferURL
    try {
      await httpPost(url, item, loginStore.userToken)
      walletStore.fetchWalletBalance(loginStore.userToken, true)
    } catch (error) {
      showError("Error", "Cannot create item, try again later")
      console.log(error)
    }
  }

  //handle for mint
  const onMintClick = () => {
    if (!nftFileUrl) {
      showError("Error", "Please load the image.")
      return
    }
    if (!itemName.length) {
      showError("Error", "Please fill the item name.")
      return
    }
    if (!distributionRightsApproved) {
      showError("Error", "Please confirm distribution rights")
      return
    }

    createNftItem()
    walletStore.fetchOwnTransactions(
      loginStore.initialData.walletAddress,
      100,
      0
    )
    Alert.alert(
      "Minting...",
      "Awesome! 😎 Once blockchain confirms it, you will see this Item in your wallet and Profile screen.",
      [
        { text: "Mint another", onPress: () => clearData() },
        {
          text: "My Profile",
          onPress: () => {
            navigation.navigate("ProfileScreen", {
              viewItems: true,
            })
            clearData()
          },
        },
      ]
    )
  }

  //dialog to choose a file
  const chooseImageOption = () => {
    Alert.alert("Choose a file", "", [
      { text: "Open from files", onPress: () => setNftFile() },
      { text: "Dismiss", onPress: () => console.log("dismissed") },
    ])
  }

  //handle to upload file
  const sendFiles = async (data: any) => {
    setLoading(true)
    try {
      const url = fileUpload
      const response = await uploadFiles(data, loginStore.userToken, url)
      console.log(JSON.stringify(response), "sdfasdfadf")
      setFileId(response.results[0]["_id"])
      setLoading(false)
      setNftFileUrl(response.results[0].location)
    } catch (error) {
      console.log(error)
    }
  }

  //handle to set NFT file from file
  const setNftFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.audio,
          DocumentPicker.types.video,
        ],
      })
      setFilePickResult(res[0])
      const data = new FormData()
      data.append("files", {
        name: res[0].name,
        type: res[0].type,
        uri: res[0].uri,
      })
      sendFiles(data)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err
      }
    }
  }

  return (
    <Fragment>
      <View>
        <SecondaryHeader title="Mint Item" />
      </View>
      <ScrollView style={classes.container}>
        <View style={classes.contentContainer}>
          <View style={classes.section1}>
            <TextInput
              value={itemName}
              onChangeText={(text) => setItemName(text)}
              placeholder="Item Name"
              placeholderTextColor={commonColors.primaryColor}
              style={classes.itemNameInput}
              maxLength={50}
            />
          </View>

          <HStack justifyContent={"space-between"} mt={"2"}>
            <TouchableOpacity
              onPress={chooseImageOption}
              style={{ alignItems: "flex-start", width: wp("50%") }}
            >
              <VStack
                justifyContent={"center"}
                alignItems={"center"}
                style={classes.filePreviewContainer}
              >
                {nftFileUrl ? (
                  <>
                    {isAudioMimetype(filePickResult.type) ? (
                      <AntIcon
                        name={"playcircleo"}
                        color={commonColors.primaryColor}
                        size={hp("5%")}
                      />
                    ) : (
                      <FastImage
                        source={{
                          uri: nftFileUrl,
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        style={{
                          width: wp("50%"),
                          height: wp("50%"),
                          borderRadius: 10,
                        }}
                      />
                    )}
                  </>
                ) : (
                  <View>
                    <AntIcon
                      name="plus"
                      size={hp("10%")}
                      color={commonColors.primaryColor}
                    />
                    <Text style={classes.addFileText}>Add file</Text>
                  </View>
                )}
              </VStack>
            </TouchableOpacity>
            <View style={classes.selectContainer}>
              <Text style={[classes.selectTextStyle, { left: 5 }]}>
                {" "}
                Rarity
              </Text>
              <Text style={[classes.selectTextStyle, { right: 40 }]}>
                {" "}
                {selectedValue}
              </Text>

              <View />
              <>
                <TouchableOpacity onPress={toggleModal}>
                  <AntIcon
                    color={commonColors.primaryColor}
                    name="caretdown"
                    size={hp("2%")}
                    style={{ marginRight: 5, marginBottom: 2 }}
                  />
                </TouchableOpacity>
              </>
            </View>
          </HStack>

          <TouchableOpacity
            disabled={loading}
            onPress={onMintClick}
            style={classes.createButton}
          >
            <VStack justifyContent={"center"} alignItems={"center"} flex={1}>
              {loading ? (
                <ActivityIndicator
                  animating={loading}
                  size="small"
                  color={"white"}
                />
              ) : (
                <Text style={classes.createButtonText}>Mint Item</Text>
              )}
            </VStack>
          </TouchableOpacity>
          <View style={classes.checkboxContainer}>
            <CheckBox
              onCheckColor={commonColors.primaryColor}
              onTintColor={commonColors.primaryColor}
              value={distributionRightsApproved}
              onValueChange={setDistributionRightsApproved}
              style={{ marginRight: 3 }}
            />
            <Text style={{ color: commonColors.primaryColor }}>
              By proceeding I confirm that I have the rights to distribute the
              above content.
            </Text>
          </View>
        </View>
      </ScrollView>
      <Modal
        onBackdropPress={() => setModalVisible(false)}
        isVisible={isModalVisible}
      >
        <VStack
          justifyContent={"center"}
          alignItems={"center"}
          bgColor={"white"}
          borderRadius={10}
        >
          {selectOptions.map((item) => {
            return (
              <TouchableOpacity
                key={item}
                onPress={() => selectNftQuantity(item)}
                style={classes.rarityItems}
              >
                <Text style={classes.quantityItem}>{item}</Text>
              </TouchableOpacity>
            )
          })}
        </VStack>
      </Modal>
    </Fragment>
  )
}

export default MintScreen

//styles
const classes = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  filePreviewContainer: {
    width: wp("50%"),
    height: wp("50%"),
    borderRadius: 10,
    borderColor: commonColors.primaryColor,
    borderWidth: 1,
    marginRight: wp("5%"),
  },
  selectContainer: {
    borderColor: commonColors.primaryColor,
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: wp("35%"),
    height: wp("10%"),
  },
  addFileText: {
    marginTop: "auto",
    fontFamily: textStyles.lightFont,
    fontSize: hp("2.6%"),
    color: commonColors.primaryColor,
  },
  contentContainer: {
    flex: 1,
    margin: 20,
    marginTop: 0,
  },
  section1: {
    flexDirection: "row",
    marginTop: 20,
  },

  selectTextStyle: {
    fontFamily: textStyles.lightFont,
    color: commonColors.primaryColor,
    position: "absolute",
  },
  itemNameInput: {
    color: "black",
    borderWidth: 1,
    borderColor: commonColors.primaryColor,
    borderRadius: 5,
    flex: 1,
    paddingLeft: 20,
    alignItems: "flex-start",
    height: wp("14%"),
    fontFamily: textStyles.lightFont,
    fontSize: hp("1.8%"),
  },
  checkboxContainer: {
    flexDirection: "row",
    width: wp("80%"),
    alignItems: "center",
    marginTop: 10,
  },
  quantityItem: {
    fontSize: hp("2.23%"),
    fontFamily: textStyles.regularFont,
    textAlign: "left",
    paddingLeft: 5,
    color: commonColors.primaryColor,
  },
  rarityItems: {
    paddingLeft: 5,
    paddingVertical: 5,
    borderBottomColor: commonColors.primaryColor,
    borderBottomWidth: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  createButton: {
    backgroundColor: commonColors.primaryColor,
    borderRadius: 5,
    height: hp("7%"),
    marginTop: 20,
  },
  createButtonText: {
    fontSize: hp("2%"),
    color: "#fff",
    fontFamily: textStyles.regularFont,
  },
})
//styles
