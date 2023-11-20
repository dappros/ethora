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
import SecondaryHeader from "../components/SecondaryHeader/SecondaryHeader"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import { commonColors, textStyles } from "../../docs/config"
import AntIcon from "react-native-vector-icons/AntDesign"
import FastImage from "react-native-fast-image"
import { launchCamera, launchImageLibrary } from "react-native-image-picker"
import DocumentPicker from "react-native-document-picker"
import { uploadFiles } from "../helpers/uploadFiles"
import { useStores } from "../stores/context"
import { showToast } from "../components/Toast/toast"
import { useNavigation } from "@react-navigation/native"
import { httpPost } from "../config/apiService"
import { docsURL, fileUpload } from "../config/routesConstants"
import CheckBox from "@react-native-community/checkbox"
import Modal from "react-native-modal"
import {
  audioMimetypes,
  imageMimetypes,
  pdfMimemtype,
} from "../constants/mimeTypes"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

interface MintScreenProps {}

const options = {
  title: "Select Avatar",
  storageOptions: {
    skipBackup: true,
    path: "images",
  },
  saveToPhotos: true,
}

const UploadDocumentsScreen = (props: MintScreenProps) => {
  const { loginStore, walletStore, apiStore, debugStore } = useStores()
  const navigation = useNavigation()

  const [itemName, setItemName] = useState<string>("")
  const [doctorsName, setDoctorsName] = useState<string>("")
  const [reportType, setReportType] = useState<string>("")
  const [reportKind, setReportKind] = useState<string>("")

  const [avatarSource, setAvatarSource] = useState<string | null>(null)
  const [filePickResult, setFilePickResult] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedValue, setSelectedValue] = useState<number>(1)
  const [uploadedFile, setUploadedFile] = useState<any>({
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
  })
  const [isModalVisible, setModalVisible] = useState<boolean>(false)
  const [isSelected, setSelection] = useState<boolean>(true)
  const [date, setDate] = useState(new Date())
  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  }
  const [open, setOpen] = useState(false)
  const keyboardRef = useRef()

  const clearData = () => {
    setLoading(false)
    setAvatarSource(null)
    setItemName("")
    setSelection(false)
    setUploadedFile({
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
    })
    setReportKind("")
    setReportType("")
    setAvatarSource(null)
    setDoctorsName("")
    setDate(new Date())
  }

  const selectNftQuantity = (value: number) => {
    setSelectedValue(value)
    setModalVisible(false)
  }
  const createNftItem = async () => {
    const item = { files: [uploadedFile.location], documentName: itemName }

    // alert(JSON.stringify(item))
    const url = apiStore.defaultUrl + docsURL
    setLoading(true)
    try {
      const res = await httpPost(url, item, loginStore.userToken)
      // alert(JSON.stringify(res.data))

      debugStore.addLogsApi(res.data)
      walletStore.fetchWalletBalance(loginStore.userToken, true)
    } catch (error) {
      showToast("error", "Error", "Cannot create item, try again later", "top")
      console.log(error.response)
    }
    setLoading(false)
  }

  const onUploadClick = async () => {
    if (!itemName.length) {
      showToast("error", "Error", "Please fill the item name.", "top")
      return
    }
    if (!isSelected) {
      showToast("error", "Error", "Please confirm distribution rights", "top")
      return
    }

    await createNftItem()
    walletStore.fetchOwnTransactions(
      loginStore.initialData.walletAddress,
      100,
      0
    )
    showToast(
      "success",
      "Success",
      "You minted new document, it will appear in your profile",
      "bottom"
    )
    clearData()
  }

  const chooseImageOption = () => {
    Alert.alert("Choose a file", "", [
      { text: "Open from files", onPress: () => setChatAvatar("files") },
      { text: "Dismiss", onPress: () => console.log("dismissed") },
    ])
  }

  const sendFiles = async (data: any) => {
    setLoading(true)
    try {
      const url = apiStore.defaultUrl + fileUpload
      const response = await uploadFiles(data, loginStore.userToken, url)
      setLoading(false)

      setUploadedFile(response.results[0])
      debugStore.addLogsApi(response.results[0])
      // alert(JSON.stringify(response.results[0]))
      const isPdf = !!pdfMimemtype[response.results[0].mimetype]
      setAvatarSource(
        isPdf
          ? response.results[0].locationPreview
          : response.results[0].location
      )
    } catch (error) {
      console.log(error)
    }
  }

  const setChatAvatar = async (type: string) => {
    if (type === "image") {
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker")
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error)
        } else {
          const data = new FormData()
          data.append("files", {
            name: response.fileName,
            type: response.type,
            uri: response.uri,
          })
          sendFiles(data)
        }
      })
    } else if (type === "photo") {
      launchCamera(options, (response) => {
        const data = new FormData()
        data.append("files", {
          name: response.fileName,
          type: response.type,
          uri: response.uri,
        })
        sendFiles(data)
      })
    } else {
      try {
        const res = await DocumentPicker.pick({
          type: [
            DocumentPicker.types.images,
            DocumentPicker.types.audio,
            DocumentPicker.types.video,
            DocumentPicker.types.pdf,
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
  }

  return (
    <KeyboardAwareScrollView ref={keyboardRef}>
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

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              onPress={chooseImageOption}
              style={{ alignItems: "flex-start", width: wp("90%") }}
            >
              <View
                style={{
                  ...classes.alignCenter,
                  width: wp("90%"),
                  height: wp("50%"),
                  borderRadius: 10,
                  borderColor: commonColors.primaryColor,
                  borderWidth: 1,
                  marginRight: wp("5%"),
                }}
              >
                {avatarSource !== null ? (
                  <>
                    {audioMimetypes[uploadedFile.mimetype] && (
                      <AntIcon
                        name={"playcircleo"}
                        color={commonColors.primaryColor}
                        size={hp("5%")}
                      />
                    )}
                    {!!imageMimetypes[uploadedFile.mimetype] && (
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
                    {!!pdfMimemtype[uploadedFile.mimetype] && (
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
                    <Text
                      style={{
                        marginTop: "auto",
                        fontFamily: textStyles.lightFont,
                        fontSize: hp("2.6%"),
                        color: commonColors.primaryColor,
                      }}
                    >
                      Add file
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            disabled={loading}
            onPress={onUploadClick}
            accessibilityLabel={"Create document"}
            style={classes.createButton}
          >
            <View
              style={{
                ...classes.alignCenter,
                flex: 1,
              }}
            >
              {loading ? (
                <ActivityIndicator
                  animating={loading}
                  size="small"
                  color={"white"}
                />
              ) : (
                <Text style={classes.createButtonText}>Upload file</Text>
              )}
            </View>
          </TouchableOpacity>
          <View style={classes.checkboxContainer}>
            <CheckBox
              onCheckColor={commonColors.primaryColor}
              onTintColor={commonColors.primaryColor}
              value={isSelected}
              onValueChange={setSelection}
              style={{ marginRight: 3, color: commonColors.primaryColor }}
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
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => selectNftQuantity(1)}
            style={classes.rarityItems}
          >
            <Text style={classes.quantityItem}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => selectNftQuantity(2)}
            style={classes.rarityItems}
          >
            <Text style={classes.quantityItem}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => selectNftQuantity(3)}
            style={classes.rarityItems}
          >
            <Text style={classes.quantityItem}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => selectNftQuantity(4)}
            style={classes.rarityItems}
          >
            <Text style={classes.quantityItem}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => selectNftQuantity(5)}
            style={classes.rarityItems}
          >
            <Text style={classes.quantityItem}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => selectNftQuantity(6)}
            style={classes.rarityItems}
          >
            <Text style={classes.quantityItem}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => selectNftQuantity(7)}
            style={classes.rarityItems}
          >
            <Text style={classes.quantityItem}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => selectNftQuantity(8)}
            style={classes.rarityItems}
          >
            <Text style={classes.quantityItem}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => selectNftQuantity(9)}
            style={classes.rarityItems}
          >
            <Text style={classes.quantityItem}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => selectNftQuantity(10)}
            style={classes.rarityItems}
          >
            <Text style={classes.quantityItem}>10</Text>
          </TouchableOpacity>

          {/* <Button title="Hide modal" onPress={toggleModal} /> */}
        </View>
      </Modal>
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
  alignCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
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
