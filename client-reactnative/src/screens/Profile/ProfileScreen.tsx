/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import React, { useState, useEffect } from "react"
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from "react-native"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"

import { Avatar, HStack, VStack } from "native-base"

import { observer } from "mobx-react-lite"
import Hyperlink from "react-native-hyperlink"

import { useNavigation } from "@react-navigation/native"
import AntIcon from "react-native-vector-icons/AntDesign"

import DocumentPicker from "react-native-document-picker"
import { commonColors, textStyles } from "../../../docs/config"
import ProfileModal from "../../components/Modals/Profile/ProfileModal"
import { QRModal } from "../../components/Modals/QR/QRModal"
import TransactionsList from "../../components/Nft/NftTransactionList"
import { ProfileTabs } from "../../components/Profile/ProfileTabs"
import SecondaryHeader from "../../components/SecondaryHeader/SecondaryHeader"
import { showToast } from "../../components/Toast/toast"
import { httpUploadPut } from "../../config/apiService"
import { changeUserData, fileUpload } from "../../config/routesConstants"
import { pattern1, pattern2 } from "../../helpers/chat/chatLinkpattern"
import openChatFromChatLink from "../../helpers/chat/openChatFromChatLink"
import parseLink from "../../helpers/parseLink"
import { generateProfileLink } from "../../helpers/generateProfileLink"
import { useStores } from "../../stores/context"
import { updateVCard } from "../../xmpp/stanzas"
import { uploadFiles } from "../../helpers/uploadFiles"

const { primaryColor, primaryDarkColor } = commonColors

export const ProfileScreen = observer(() => {
  const { loginStore, walletStore, chatStore, apiStore } = useStores()

  const navigation = useNavigation()

  const { setOffset, setTotal, clearPaginationData, transactions } = walletStore

  const { userAvatar, userDescription, initialData, updateUserDisplayName } =
    loginStore

  const { firstName, lastName, walletAddress } = initialData

  const coinData = walletStore.balance

  const [activeTab, setActiveTab] = useState(0)
  const [activeAssetTab, setActiveAssetTab] = useState(1)

  const [itemsBalance, setItemsBalance] = useState(0)

  const [modalType, setModalType] = useState<"name" | "description" | "">("")
  const [modalVisible, setModalVisible] = useState(false)

  const [qrModalVisible, setQrModalVisible] = useState(false)

  const [isDescriptionEditable, setIsDescriptionEditable] = useState(false)
  const [descriptionLocal, setDescriptionLocal] = useState(userDescription)
  const [firstNameLocal, setFirstNameLocal] = useState(firstName)
  const [lastNameLocal, setLastNameLocal] = useState(lastName)
  const userAvatarLocal = userAvatar
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

  useEffect(() => {
    setOffset(0)
    setTotal(0)
    walletStore.fetchOwnTransactions(walletAddress, walletStore.limit, 0)
    walletStore.fetchWalletBalance(loginStore.userToken, true)
    walletStore.getDocuments(walletAddress)

    return () => {
      clearPaginationData()
    }
  }, [])
  useEffect(() => {
    setDescriptionLocal(userDescription)
  }, [userDescription])

  const calculateAssetsCount = () => {
    setItemsBalance(
      walletStore.nftItems.reduce(
        (acc, item) => (acc += parseFloat(item.balance.toString())),
        0
      )
    )
  }

  useEffect(() => {
    calculateAssetsCount()
    return () => {}
  }, [walletStore.nftItems, coinData])

  const onNamePressed = () => {
    setModalType("name")
    setModalVisible(true)
  }

  const onDescriptionPressed = () => {
    setIsDescriptionEditable(true)
    setModalType("description")
    setModalVisible(true)
  }

  //changes the user description locally
  const onDescriptionChange = (text: string) => {
    setDescriptionLocal(text)
  }

  //when user clicks on the backdrop of the modal
  const onBackdropPress = () => {
    setFirstNameLocal(firstName)
    setLastNameLocal(lastName)
    setDescriptionLocal(userDescription)
    setIsDescriptionEditable(!isDescriptionEditable)
    setModalVisible(false)
  }

  //changes the user's profile name locally
  const onNameChange = (type: "firstName" | "lastName", text: string) => {
    type === "firstName" ? setFirstNameLocal(text) : setLastNameLocal(text)
  }

  const setDescription = async () => {
    if (userAvatarLocal || descriptionLocal) {
      updateVCard(
        userAvatarLocal,
        descriptionLocal,
        firstName + " " + lastName,
        chatStore.xmpp
      )
    }

    if (!descriptionLocal) {
      updateVCard(userAvatarLocal, "No description", null, chatStore.xmpp)
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
        userAvatarLocal,
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

  const handleChatLinks = (url: string) => {
    const parsedChatId = parseLink(url)
    if (parsedChatId) {
      const chatJID = parsedChatId + apiStore.xmppDomains.CONFERENCEDOMAIN
      //argument url can be a chatlink or simple link
      //first check if url is a chat link if yes then open chatlink else open the link via browser
      if (pattern1.test(url) || pattern2.test(url)) {
        openChatFromChatLink(chatJID, walletAddress, navigation, chatStore.xmpp)
      } else {
        Linking.openURL(url)
      }
    }
  }

  const QRPressed = () => {
    // const xmppId =
    //   loginStore.initialData.xmppUsername + '@' + apiStore.xmppDomains.DOMAIN;
    // const profileLink = `=profileLink&firstName=${firstName}&lastName=${lastName}&walletAddress=${walletAddress}&xmppId=${xmppId}`;
    setQrModalVisible(true)
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
      updateVCard(file.location, descriptionLocal, null, chatStore.xmpp)
    } catch (error) {
      console.log(error)
    }
  }
  //change user avatar
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
  const onTransactionNumberPress = () => {
    setActiveTab(1)
  }
  // shows profile tabs which contain documents, items... or transactions
  const loadTabContent = () => {
    if (activeTab === 0) {
      return (
        <ProfileTabs
          activeAssetTab={activeAssetTab}
          setActiveAssetTab={setActiveAssetTab}
          documents={walletStore.documents}
          collections={walletStore.collections}
          coinsItems={coinData}
          userWalletAddress={walletAddress}
          nftItems={walletStore.nftItems}
          itemsBalance={itemsBalance}
        />
      )
    }

    if (activeTab === 1) {
      return (
        <View style={{ paddingBottom: hp("18%") }}>
          <TransactionsList
            transactions={transactions}
            walletAddress={walletAddress}
            onEndReached={() => {
              if (transactions.length < walletStore.total) {
                walletStore.fetchOwnTransactions(
                  walletAddress,
                  walletStore.limit,
                  walletStore.offset
                )
              }
            }}
          />
        </View>
      )
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ backgroundColor: primaryDarkColor, flex: 1 }}>
        <SecondaryHeader
          title={"User's profile"}
          isQR
          onQRPressed={QRPressed}
          onBackPress={() =>
            activeTab === 1 ? setActiveTab(0) : navigation.goBack()
          }
        />

        <View style={{ zIndex: +1, alignItems: "center" }}>
          <HStack
            width={hp("10.46%")}
            height={hp("10.46%")}
            position={"absolute"}
            justifyContent={"center"}
            alignItems={"center"}
            bgColor={primaryColor}
            borderRadius={hp("10.46%") / 2}
          >
            <TouchableOpacity
              onPress={onAvatarPress}
              accessibilityLabel="Photo"
            >
              <Avatar
                bg={commonColors.primaryColor}
                size={"xl"}
                source={
                  uploadedAvatar.location || loginStore.userAvatar
                    ? {
                        uri: uploadedAvatar.location || loginStore.userAvatar,
                      }
                    : undefined
                }
              >
                {firstNameLocal[0] + lastNameLocal[0]}
              </Avatar>
            </TouchableOpacity>
          </HStack>
        </View>
        <VStack
          marginTop={hp("5.5%")}
          bgColor={"#FBFBFB"}
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
              marginTop: hp("5.54%"),
              backgroundColor: "white",
            }}
          >
            <HStack alignItems={"center"}>
              <TouchableOpacity
                onPress={onNamePressed}
                style={{ marginLeft: 5 }}
              >
                <Text
                  style={{
                    fontSize: hp("2.216%"),
                    fontFamily: textStyles.mediumFont,
                    color: "#000000",
                  }}
                >
                  {firstNameLocal} {lastNameLocal}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel="Your Transactions"
                onPress={onTransactionNumberPress}
                style={{ marginLeft: 5 }}
              >
                <Text
                  style={{
                    fontSize: hp("2.216%"),
                    fontFamily: textStyles.mediumFont,
                    color: commonColors.primaryColor,
                  }}
                >
                  (
                  <Text
                    style={{
                      fontSize: hp("2.216%"),
                      fontFamily: textStyles.mediumFont,
                      color: commonColors.primaryColor,
                      textDecorationLine: "underline",
                    }}
                  >
                    {walletStore.total}
                  </Text>
                  )
                </Text>
              </TouchableOpacity>
            </HStack>
            <HStack paddingX={wp("4%")}>
              <Hyperlink
                onPress={(url) => handleChatLinks(url)}
                linkStyle={{
                  color: "#2980b9",
                  fontSize: hp("1.8%"),
                  textDecorationLine: "underline",
                }}
              >
                <Text
                  accessibilityLabel="Bio"
                  style={{
                    fontSize: hp("2.23%"),
                    fontFamily: textStyles.regularFont,
                    textAlign: "center",
                    color: primaryColor,
                  }}
                >
                  {descriptionLocal && !isDescriptionEditable
                    ? descriptionLocal
                    : "Add your description"}
                </Text>
                <TouchableOpacity
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
              </Hyperlink>
            </HStack>
          </View>

          <View style={{ backgroundColor: "white" }}>{loadTabContent()}</View>
        </VStack>
      </View>
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
    </SafeAreaView>
  )
})
