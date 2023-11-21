import { Avatar, HStack, VStack } from "native-base"
import React, { useEffect, useState } from "react"
import { coinsMainName, commonColors, textStyles } from "../../../docs/config"
import SecondaryHeader from "../SecondaryHeader/SecondaryHeader"
import { useNavigation } from "@react-navigation/native"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import SkeletonContent from "react-native-skeleton-content-nonexpo"
import { ICustomViewStyle } from "react-native-skeleton-content-nonexpo/lib/Constants"
import { useStores } from "../../stores/context"
import DocumentPicker from "react-native-document-picker"
import { changeUserData, fileUpload } from "../../config/routesConstants"
import { uploadFiles } from "../../helpers/uploadFiles"
import { httpUploadPut } from "../../config/apiService"
import {
  createNewRoom,
  roomConfig,
  sendInvite,
  setOwner,
  subscribeToRoom,
  updateVCard,
} from "../../xmpp/stanzas"
import parseLink from "../../helpers/parseLink"
import { pattern1, pattern2 } from "../../helpers/chat/chatLinkpattern"
import openChatFromChatLink from "../../helpers/chat/openChatFromChatLink"
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native"
import HyperLink from "react-native-hyperlink"
import AntIcon from "react-native-vector-icons/AntDesign"
import { underscoreManipulation } from "../../helpers/underscoreLogic"
import { HomeStackNavigationProp } from "../../navigation/types"
import Ionicons from "react-native-vector-icons/Ionicons"
import { ProfileTabs } from "./ProfileTabs"
import TransactionsList from "../Nft/NftTransactionList"
import ProfileModal from "../Modals/Profile/ProfileModal"
import { showToast } from "../Toast/toast"
import { QRModal } from "../Modals/QR/QRModal"
import { generateProfileLink } from "../../helpers/generateProfileLink"
import { observer } from "mobx-react-lite"
import { filterNftBalances, produceNfmtItems } from "../../stores/walletStore"

type profileType = "my" | "other"

interface TMainProfile {
  profileType: profileType
  linkToken?: string
}

const { primaryColor, primaryDarkColor } = commonColors
const { mediumFont } = textStyles

const firstLayout: ICustomViewStyle[] = [
  {
    width: hp("10.46%"),
    height: hp("10.46%"),
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: hp("10.46%") / 2,
  },
  {
    flex: 1,
    marginTop: hp("5.5%"),
    children: [
      {
        paddingTop: hp("2.4%"),
        backgroundColor: "#FBFB7",
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        height: hp("75%"),
      },
    ],
  },
]

function getAvatarURL(
  profileType: profileType,
  uploadedAvatar: any,
  loginStore: any
) {
  if (profileType == "my") {
    if (uploadedAvatar.location || loginStore.userAvatar) {
      return {
        uri: uploadedAvatar.location || loginStore.userAvatar,
      }
    } else {
      return undefined
    }
  } else {
    if (loginStore.anotherUserAvatar) {
      return {
        uri: loginStore.anotherUserAvatar,
      }
    } else {
      return undefined
    }
  }
}

function getDescription(
  profileType: profileType,
  descriptionLocal: string,
  isDescriptionEditable: boolean,
  otherUserDescription: string
) {
  if (profileType === "my") {
    if (descriptionLocal && !isDescriptionEditable) {
      return descriptionLocal
    } else {
      return "Add your description"
    }
  } else {
    return otherUserDescription
  }
}

const MainProfile: React.FC<TMainProfile> = observer((props) => {
  const { profileType, linkToken } = props

  const { loginStore, chatStore, walletStore, apiStore, otherUserStore } =
    useStores()

  const { xmppDomains } = apiStore

  const {
    total,
    transactions,
    anotherUserTransaction,
    anotherUserBalance,
    setOffset,
    setTotal,
    clearPaginationData,
  } = walletStore

  const { xmpp, toggleShouldCount } = chatStore

  const {
    initialData,
    anotherUserFirstname,
    anotherUserLastname,
    userDescription,
    anotherUserWalletAddress,
    userAvatar,
    updateUserDisplayName,
  } = loginStore
  const { firstName, lastName, walletAddress } = initialData

  const [qrModalVisible, setQrModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(
    profileType === "my" ? false : true
  )
  const [collections, setCollections] = useState(
    profileType === "my" ? walletStore.collections : []
  )
  const [activeAssetTab, setActiveAssetTab] = useState(1)
  const [itemsBalance, setItemsBalance] = useState(0)
  const [itemsData, setItemsData] = useState([])
  const [coinData, setCoinData] = useState([])
  const [modalType, setModalType] = useState<"name" | "description" | "">("")
  const [isDescriptionEditable, setIsDescriptionEditable] = useState(false)
  const [firstNameLocal, setFirstNameLocal] = useState(
    profileType === "my" ? firstName : anotherUserFirstname
  )
  const [lastNameLocal, setLastNameLocal] = useState(
    profileType === "my" ? lastName : anotherUserLastname
  )
  const [descriptionLocal, setDescriptionLocal] = useState(userDescription)
  const [isLoadingVCard, setIsLoadingVCard] = useState(
    profileType === "my" ? false : true
  )
  const [uploadedAvatar, setUploadedAvatar] = useState({
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

  const navigation = useNavigation<HomeStackNavigationProp>()

  const AvatarURL = getAvatarURL(profileType, uploadedAvatar, loginStore)
  const description = getDescription(
    profileType,
    descriptionLocal,
    isDescriptionEditable,
    otherUserStore.description
  )

  const QRPressed = () => {
    setQrModalVisible(true)
  }

  const calculateBalances = () => {
    setItemsBalance(
      itemsData.reduce(
        (acc: number, item: any) => (acc += parseFloat(item.balance)),
        0
      )
    )
  }

  const getBalances = async () => {
    await walletStore.fetchTransaction(
      loginStore.anotherUserWalletAddress,
      10,
      0
    )
    await walletStore.fetchOtherUserWalletBalance(
      loginStore.anotherUserWalletAddress,
      loginStore.userToken,
      linkToken || ""
    )
    setIsLoading(false)
    setIsLoadingVCard(false)
  }

  //when user clicks on the backdrop of the modal
  const onBackdropPress = () => {
    setFirstNameLocal(firstName)
    setLastNameLocal(lastName)
    setDescriptionLocal(userDescription)
    setIsDescriptionEditable(!isDescriptionEditable)
    setModalVisible(false)
  }

  //changes the user description locally
  const onDescriptionChange = (text: string) => {
    setDescriptionLocal(text)
  }

  const setNewName = () => {
    //call api to dapp server to change username
    //save in async storage
    //and then change in mobx store
    if (firstNameLocal) {
      const bodyData = {
        firstName: firstNameLocal,
        lastName: lastNameLocal,
      }
      updateVCard(
        userAvatar,
        descriptionLocal,
        firstNameLocal + " " + lastNameLocal,
        chatStore.xmpp
      )
      updateUserDisplayName(bodyData)
    } else {
      setFirstNameLocal(firstName)
      showToast("error", "Error", "First name is required", "top")
    }
    setModalVisible(false)
  }

  const setDescription = async () => {
    if (userAvatar || descriptionLocal) {
      updateVCard(
        userAvatar,
        descriptionLocal,
        firstName + " " + lastName,
        chatStore.xmpp
      )
    }

    if (!descriptionLocal) {
      updateVCard(userAvatar, "No description", null, xmpp)
    }
    const formData = new FormData()
    formData.append("description", descriptionLocal)
    await httpUploadPut(
      changeUserData,
      formData,
      loginStore.userToken,
      console.log
    )
    setIsDescriptionEditable(false)
    setModalVisible(false)
  }

  //changes the user's profile name locally
  const onNameChange = (type: "firstName" | "lastName", text: string) => {
    type === "firstName" ? setFirstNameLocal(text) : setLastNameLocal(text)
  }

  const sendFiles = async (data: any) => {
    try {
      const url = fileUpload
      const response = await uploadFiles(data, loginStore.userToken, url)
      const file = response.results[0]
      setUploadedAvatar(file)
      const formData = new FormData()
      formData.append("description", descriptionLocal)
      formData.append("file", file.location)
      await httpUploadPut(
        changeUserData,
        formData,
        loginStore.userToken,
        console.log
      )
      updateVCard(file.location, descriptionLocal, null, xmpp)
    } catch (error) {
      console.log(error)
    }
  }

  const onAvatarPress = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      })
      const formData = new FormData()
      formData.append("files", {
        name: res.name,
        type: res.type,
        uri: res.uri,
      })
      sendFiles(formData)
    } catch (error) {
      console.log(error)
    }
  }

  const onNamePressed = () => {
    setModalType("name")
    setModalVisible(true)
  }

  const handleSetActiveTab = (tabIndex: number) => {
    setActiveTab(tabIndex)
  }

  const onDescriptionPressed = () => {
    setIsDescriptionEditable(true)
    setModalType("description")
    setModalVisible(true)
  }

  const handleChatLinks = (url: string) => {
    const parsedLink = parseLink(url)
    if (parsedLink) {
      const chatId = parsedLink.searchParams.get("c")
      if (chatId) {
        const chatJID = chatId + xmppDomains.CONFERENCEDOMAIN
        //argument url can be a chatlink or simple link
        //first check if url is a chat link if yes then open chatlink else open the link via browser
        if (pattern1.test(url) || pattern2.test(url)) {
          openChatFromChatLink(
            chatJID,
            walletAddress,
            navigation as any,
            chatStore.xmpp
          )
        } else {
          Linking.openURL(url)
        }
      }
    }
  }

  const onDirectChatPress = () => {
    const otherUserWalletAddress = loginStore.anotherUserWalletAddress
    const myWalletAddress = loginStore.initialData.walletAddress
    const combinedWalletAddress = [myWalletAddress, otherUserWalletAddress]
      .sort()
      .join("_")

    const roomJid =
      combinedWalletAddress.toLowerCase() +
      apiStore.xmppDomains.CONFERENCEDOMAIN
    const combinedUsersName = [
      loginStore.initialData.firstName,
      loginStore.anotherUserFirstname,
    ]
      .sort()
      .join(" and ")

    const myXmppUserName = underscoreManipulation(myWalletAddress)
    createNewRoom(myXmppUserName, combinedWalletAddress.toLowerCase(), xmpp)
    setOwner(myXmppUserName, combinedWalletAddress.toLowerCase(), xmpp)
    roomConfig(
      myXmppUserName,
      combinedWalletAddress.toLowerCase(),
      { roomName: combinedUsersName, roomDescription: "" },
      xmpp
    )
    subscribeToRoom(roomJid, myXmppUserName, xmpp)

    navigation.navigate("ChatScreen", {
      chatJid: roomJid,
      chatName: combinedUsersName,
    })
    toggleShouldCount(false)

    setTimeout(() => {
      sendInvite(
        underscoreManipulation(myWalletAddress),
        roomJid.toLowerCase(),
        underscoreManipulation(otherUserWalletAddress),
        xmpp
      )
    }, 3000)
  }

  // shows profile tabs which contain documents, items... or transactions
  const loadTabContent = () => {
    if (activeTab === 0) {
      return (
        <ProfileTabs
          activeAssetTab={activeAssetTab}
          setActiveAssetTab={setActiveAssetTab}
          documents={profileType === "my" ? walletStore.documents : []}
          collections={collections}
          coinsItems={coinData}
          userWalletAddress={
            profileType == "my" ? walletAddress : anotherUserWalletAddress
          }
          nftItems={profileType == "my" ? walletStore.nftItems : itemsData}
          itemsBalance={itemsBalance}
        />
      )
    }

    if (activeTab === 1) {
      return (
        <View style={{ paddingBottom: hp("18%") }}>
          <TransactionsList
            transactions={
              profileType == "my" ? transactions : anotherUserTransaction
            }
            walletAddress={
              profileType == "my" ? walletAddress : anotherUserWalletAddress
            }
            onEndReached={() => {
              if (profileType === "my") {
                if (transactions.length < walletStore.total) {
                  walletStore.fetchOwnTransactions(
                    walletAddress,
                    walletStore.limit,
                    walletStore.offset
                  )
                }
              } else {
                if (anotherUserTransaction.length < walletStore.total) {
                  walletStore.fetchTransaction(
                    anotherUserWalletAddress,
                    walletStore.limit,
                    walletStore.offset
                  )
                }
              }
            }}
          />
        </View>
      )
    }
  }

  const calculateAssetsCount = () => {
    setItemsBalance(
      walletStore.nftItems.reduce(
        (acc, item) => (acc += parseFloat(item.balance.toString())),
        0
      )
    )
  }

  useEffect(() => {
    setOffset(0)
    setTotal(0)

    if (profileType === "my") {
      walletStore.fetchOwnTransactions(walletAddress, walletStore.limit, 0)
      walletStore.fetchWalletBalance(loginStore.userToken, true)
      walletStore.getDocuments(walletAddress)
    }

    return () => {
      clearPaginationData()
      setCoinData([])
      setIsLoading(true)
      setIsLoadingVCard(profileType === "my" ? false : true)
      setItemsData([])
    }
  }, [])

  useEffect(() => {
    if (profileType === "my") setDescriptionLocal(userDescription)
  }, [userDescription])

  useEffect(() => {
    if (profileType === "my") calculateAssetsCount()
    return () => {}
  }, [walletStore.nftItems, coinData])

  useEffect(() => {
    if (profileType === "other") {
      getBalances()
    }
  }, [anotherUserWalletAddress])

  useEffect(() => {
    if (profileType === "other" && anotherUserBalance?.length > 0) {
      const nfmtItems = produceNfmtItems(anotherUserBalance)
      setCoinData(
        anotherUserBalance.filter(
          (item: any) => item.tokenName === coinsMainName
        )
      )
      setItemsData(
        anotherUserBalance

          .filter(filterNftBalances)
          .concat(nfmtItems as never)

          .reverse()
      )
      // setCollections(walletStore.anotherUserNfmtCollections);

      calculateBalances()
    }
  }, [anotherUserBalance])

  useEffect(() => {
    calculateBalances()

    return () => {}
  }, [itemsData, coinData])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ backgroundColor: primaryDarkColor, flex: 1 }}>
        <SecondaryHeader
          title={"User's profile"}
          isQR={profileType === "my"}
          onQRPressed={QRPressed}
          onBackPress={() =>
            activeTab === 1 ? setActiveTab(0) : navigation.goBack()
          }
        />

        <View
          style={{
            zIndex: +1,
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <HStack
            width={hp("10.46%")}
            height={hp("10.46%")}
            position={"absolute"}
            justifyContent={"center"}
            alignItems={"center"}
            bgColor={primaryColor}
            borderRadius={hp("10.46%") / 2}
          >
            <SkeletonContent
              containerStyle={{ alignItems: "center" }}
              layout={firstLayout}
              isLoading={isLoadingVCard}
            >
              <TouchableOpacity
                disabled={profileType === "other"}
                onPress={onAvatarPress}
                accessibilityLabel="Photo"
              >
                <Avatar
                  bg={commonColors.primaryColor}
                  size={"xl"}
                  source={AvatarURL}
                >
                  {firstNameLocal[0] + lastNameLocal[0]}
                </Avatar>
              </TouchableOpacity>
            </SkeletonContent>
          </HStack>
        </View>

        <VStack
          marginTop={hp("7.5%")}
          bgColor={"white"}
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.9,
            shadowRadius: 6.27,

            elevation: 5,
          }}
          borderTopLeftRadius={30}
          borderTopRightRadius={30}
          height={hp("75%")}
        >
          <View
            style={{
              alignItems: "center",
              marginTop: hp("7.54%"),
              backgroundColor: "white",
            }}
          >
            <HStack alignItems={"center"}>
              <TouchableOpacity
                disabled={profileType === "other"}
                onPress={onNamePressed}
                style={{ marginLeft: 5 }}
              >
                <Text
                  style={{
                    fontSize: hp("2.216%"),
                    fontFamily: mediumFont,
                    color: "#000000",
                  }}
                >
                  {firstNameLocal} {lastNameLocal}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel={
                  profileType === "my"
                    ? "Your Transactions"
                    : "User Transactions"
                }
                onPress={() => handleSetActiveTab(1)}
                style={{ marginLeft: 5 }}
              >
                <Text
                  style={{
                    fontSize: hp("2.216%"),
                    fontFamily: mediumFont,
                    color: primaryColor,
                  }}
                >
                  (
                  <Text
                    style={{
                      fontSize: hp("2.216%"),
                      fontFamily: mediumFont,
                      color: primaryColor,
                      textDecorationLine: "underline",
                    }}
                  >
                    {total}
                  </Text>
                  )
                </Text>
              </TouchableOpacity>
            </HStack>
            <HStack paddingX={wp("4%")}>
              <SkeletonContent
                containerStyle={{ width: wp("100%"), alignItems: "center" }}
                layout={[{ width: wp("60%"), height: 70, marginBottom: 6 }]}
                isLoading={isLoadingVCard}
              >
                <HyperLink
                  onPress={(url: string) =>
                    profileType === "my" && handleChatLinks(url)
                  }
                  linkStyle={{
                    color: "#2980b9",
                    fontSize: hp("1.8%"),
                    textDecorationLine: "underline",
                  }}
                >
                  <Text accessibilityLabel="Bio" style={styles.descriptionText}>
                    {description}
                  </Text>
                  {profileType === "my" && (
                    <TouchableOpacity
                      disabled={profileType !== "my"}
                      accessibilityLabel="Edit bio"
                      onPress={onDescriptionPressed}
                      style={{ alignItems: "center", margin: 10 }}
                    >
                      <AntIcon
                        name="edit"
                        color={commonColors.primaryColor}
                        size={hp("2%")}
                      />
                    </TouchableOpacity>
                  )}
                  {profileType === "other" && (
                    <TouchableOpacity
                      accessibilityLabel="Direct message"
                      onPress={onDirectChatPress}
                      style={styles.chatButton}
                    >
                      <HStack alignItems={"center"}>
                        <Ionicons
                          name="chatbubble-ellipses"
                          size={hp("1.7%")}
                          color={"white"}
                        />

                        <Text style={{ color: "white", marginLeft: 5 }}>
                          Chat
                        </Text>
                      </HStack>
                    </TouchableOpacity>
                  )}
                </HyperLink>
              </SkeletonContent>
            </HStack>
          </View>

          <View style={{ backgroundColor: "white" }}>
            <SkeletonContent
              isLoading={isLoading}
              containerStyle={{
                width: "100%",
                padding: isLoading ? hp("3%") : 0,
                alignItems: "center",
              }}
              layout={[
                { width: wp("90%"), height: hp("30%"), marginBottom: 6 },
              ]}
            >
              {loadTabContent()}
            </SkeletonContent>
          </View>
        </VStack>
      </View>
      {profileType === "my" && (
        <>
          <ProfileModal
            description={descriptionLocal}
            firstName={firstNameLocal}
            lastName={lastNameLocal}
            isDescriptionEditable={isDescriptionEditable}
            isVisible={modalVisible}
            modalType={modalType}
            onBackdropPress={onBackdropPress}
            onDescriptionChange={onDescriptionChange}
            onNameChange={onNameChange}
            setDescription={setDescription}
            setNewName={setNewName}
          />
          <QRModal
            open={qrModalVisible}
            onClose={() => setQrModalVisible(false)}
            title={"Profile"}
            link={generateProfileLink({
              firstName: firstName,
              lastName: lastName,
              walletAddress: walletAddress,
              xmppId:
                loginStore.initialData.xmppUsername +
                "@" +
                apiStore.xmppDomains.DOMAIN,
            })}
          />
        </>
      )}
    </SafeAreaView>
  )
})

export default MainProfile

const styles = StyleSheet.create({
  descriptionText: {
    fontSize: hp("2.23%"),
    fontFamily: textStyles.regularFont,
    textAlign: "center",
    color: primaryColor,
  },
  chatButton: {
    fontSize: hp("2.23%"),
    fontFamily: textStyles.regularFont,
    textAlign: "center",
    color: "0000004D",
    backgroundColor: commonColors.primaryDarkColor,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
})
