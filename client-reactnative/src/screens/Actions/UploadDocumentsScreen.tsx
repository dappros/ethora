import React, { useRef, useState } from "react"
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import AntIcon from "react-native-vector-icons/AntDesign"
import FastImage from "react-native-fast-image"
import DocumentPicker from "react-native-document-picker"
import CheckBox from "@react-native-community/checkbox"

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { commonColors, textStyles } from "../../../docs/config"
import SecondaryHeader from "../../components/SecondaryHeader/SecondaryHeader"
import { showError, showSuccess } from "../../components/Toast/toast"
import { httpPost } from "../../config/apiService"
import { docsURL, fileUpload } from "../../config/routesConstants"
import { pdfMimemtype } from "../../constants/mimeTypes"
import { useStores } from "../../stores/context"
import {
  isAudioMimetype,
  isImageMimetype,
  isPdfMimetype,
} from "../../helpers/checkMimetypes"
import { uploadFiles } from "../../helpers/uploadFiles"
import { HStack, VStack } from "native-base"

const emptyFile = {
  _id: "",
  createdAt: "",
  expiresAt: 0,
  filename: "",
  isVisible: true,
  location: "",
  locationPreview: "",
  mimetype: "",
  originalname: "",
  ownerKey: "",
  size: 0,
  updatedAt: "",
  userId: "",
}

const UploadDocumentsScreen = () => {
  const { loginStore, walletStore, debugStore } = useStores()

  const [itemName, setItemName] = useState<string>("")
  // data api
  // const [doctorsName, setDoctorsName] = useState<string>('');
  // const [reportType, setReportType] = useState<string>('');
  // const [reportKind, setReportKind] = useState<string>('');
  // const [date, setDate] = useState(new Date());

  const [documentUrl, setDocumentUrl] = useState<string>("")

  const [loading, setLoading] = useState<boolean>(false)
  const [uploadedFile, setUploadedFile] = useState<typeof emptyFile>(emptyFile)
  const [distributionRightsApproved, setDistributionRightsApproved] =
    useState<boolean>(true)
  const keyboardRef = useRef()

  const clearData = () => {
    setLoading(false)
    setDocumentUrl("")
    setItemName("")
    setDistributionRightsApproved(false)
    setUploadedFile(emptyFile)
    // setReportKind('');
    // setReportType('');
    // setDoctorsName('');
    // setDate(new Date());
  }

  const createNftItem = async () => {
    const item = { files: [uploadedFile.location], documentName: itemName }

    // alert(JSON.stringify(item))
    const url = docsURL
    setLoading(true)
    try {
      const res = await httpPost(url, item, loginStore.userToken)
      // alert(JSON.stringify(res.data))

      debugStore.addLogsApi(res.data)
      walletStore.fetchWalletBalance(loginStore.userToken, true)
    } catch (error) {
      showError("Error", "Cannot create item, try again later")
      console.log(error.response)
    }
    setLoading(false)
  }

  const onMintClick = async () => {
    if (!documentUrl) {
      showError("Error", "Please load the image.")
      return
    }
    if (!itemName.length) {
      showError("Error", "Please fill the item name.")
      return
    }
    if (!setDistributionRightsApproved) {
      showError("Error", "Please confirm distribution rights")
      return
    }

    await createNftItem()
    walletStore.fetchOwnTransactions(
      loginStore.initialData.walletAddress,
      100,
      0
    )
    showSuccess(
      "Success",
      "You minted new document, it will appear in your profile"
    )

    clearData()
  }

  const chooseImageOption = () => {
    Alert.alert("Choose a file", "", [
      { text: "Open from files", onPress: () => setDocumentFile() },
      { text: "Dismiss", onPress: () => console.log("dismissed") },
    ])
  }

  const sendFiles = async (data: any) => {
    setLoading(true)
    try {
      const url = fileUpload
      const response = await uploadFiles(data, loginStore.userToken, url)
      setLoading(false)

      setUploadedFile(response.results[0])
      debugStore.addLogsApi(response.results[0])
      // alert(JSON.stringify(response.results[0]))
      const isPdf = !!pdfMimemtype[response.results[0].mimetype]
      setDocumentUrl(
        isPdf
          ? response.results[0].locationPreview
          : response.results[0].location
      )
    } catch (error) {
      console.log(error)
    }
  }

  const setDocumentFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.audio,
          DocumentPicker.types.video,
          DocumentPicker.types.pdf,
        ],
      })
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
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "white" }}
      // behavior={ "height"}
      // keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
      // enabled={ false}
    >
      <View>
        <SecondaryHeader title="Upload file" />
      </View>
      <ScrollView style={classes.container}>
        <View style={classes.contentContainer}>
          <View style={classes.section1}>
            <TextInput
              value={itemName}
              onChangeText={setItemName}
              placeholder="Document Name"
              placeholderTextColor={commonColors.primaryColor}
              style={classes.itemNameInput}
              maxLength={50}
            />
          </View>

          <HStack
            justifyContent={"space-between"}
            alignItems={"flex-start"}
            mt={"2"}
          >
            <TouchableOpacity
              onPress={chooseImageOption}
              style={{ alignItems: "flex-start", width: wp("90%") }}
            >
              <VStack
                justifyContent={"center"}
                alignItems={"center"}
                style={classes.filePreviewContainer}
              >
                {documentUrl ? (
                  <>
                    {isAudioMimetype(uploadedFile.mimetype) && (
                      <AntIcon
                        name={"playcircleo"}
                        color={commonColors.primaryColor}
                        size={hp("5%")}
                      />
                    )}
                    {isImageMimetype(uploadedFile.mimetype) && (
                      <FastImage
                        source={{
                          uri: uploadedFile.locationPreview,
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                        style={{
                          width: wp("90%"),
                          height: wp("50%"),
                          borderRadius: 10,
                        }}
                      />
                    )}
                    {isPdfMimetype(uploadedFile.mimetype) && (
                      <FastImage
                        source={{
                          uri: uploadedFile.locationPreview,
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                        style={{
                          width: wp("40%"),
                          height: wp("40%"),
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
                <Text style={classes.createButtonText}>Upload files</Text>
              )}
            </VStack>
          </TouchableOpacity>
          <View style={classes.checkboxContainer}>
            <CheckBox
              onCheckColor={commonColors.primaryColor}
              onTintColor={commonColors.primaryColor}
              value={distributionRightsApproved}
              onValueChange={setDistributionRightsApproved}
              style={{ marginRight: 3, color: commonColors.primaryColor }}
            />
            <Text style={{ color: commonColors.primaryColor }}>
              By proceeding I confirm that I have the rights to distribute the
              above content.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  )
}

export default UploadDocumentsScreen

const classes = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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

  textStyle: {
    fontFamily: textStyles.lightFont,
    color: commonColors.primaryColor,
    position: "absolute",
  },
  addFileText: {
    marginTop: "auto",
    fontFamily: textStyles.lightFont,
    fontSize: hp("2.6%"),
    color: commonColors.primaryColor,
  },
  itemNameInput: {
    color: "black",
    borderWidth: 1,
    borderColor: commonColors.primaryColor,
    borderRadius: 5,
    flex: 1,
    paddingLeft: 20,
    alignItems: "flex-start",
    // height: wp('10%'),
    fontFamily: textStyles.lightFont,
    fontSize: hp("1.8%"),
    paddingVertical: Platform.OS === "ios" ? 10 : 0,
  },
  checkboxContainer: {
    flexDirection: "row",
    width: wp("80%"),
    alignItems: "center",
    marginTop: 10,
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
  filePreviewContainer: {
    width: wp("90%"),
    height: wp("50%"),
    borderRadius: 10,
    borderColor: commonColors.primaryColor,
    borderWidth: 1,
    marginRight: wp("5%"),
  },
})
