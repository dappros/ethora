import {
  Actionsheet,
  AlertDialog,
  Button,
  Text,
  useDisclose,
  View,
} from "native-base"
import React, { useState, useEffect } from "react"
import { textStyles } from "../../../docs/config"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../stores/context"
import {
  reverseUnderScoreManipulation,
  underscoreManipulation,
} from "../../helpers/underscoreLogic"
import { observer } from "mobx-react-lite"
import {
  assignModerator,
  banUserr,
  changeRoomDescription,
  getListOfBannedUserInRoom,
  getRoomInfo,
  getRoomMemberInfo,
  leaveRoomXmpp,
  setRoomImage,
  subscribeToRoom,
  unAssignModerator,
  unbanUser,
  unsubscribeFromChatXmpp,
} from "../../xmpp/stanzas"
import { deleteChatRoom } from "../../components/realmModels/chatList"
import { uploadFiles } from "../../helpers/uploadFiles"
import { fileUpload } from "../../config/routesConstants"
import DocumentPicker from "react-native-document-picker"
import { renameTheRoom } from "../../helpers/RoomList/renameRoom"
import ChangeRoomNameModal from "../../components/Modals/Chat/ChangeRoomNameModal"
import ChangeRoomDescriptionModal from "../../components/Modals/Chat/ChangeRoomDescriptionModal"
import { roomListProps, roomMemberInfoProps } from "../../stores/chatStore"
import RoomDetailsCard from "../../components/Chat/ChatDetails/RoomDetailsCard"
import ChatDetailHeader from "../../components/Chat/ChatDetails/ChatDetailHeader"
import ChatDetailMemebersList from "../../components/Chat/ChatDetails/ChatDetailMembersList"
import { HomeStackNavigationProp } from "../../navigation/types"

interface longTapUserProps {
  ban_status: string
  jid: string
  last_active: string
  name: string
  profile: string
  role: string
}

export interface IuploadedImage {
  _id: string
  createdAt: string
  expiresAt: number
  filename: string
  isVisible: boolean
  location: string
  locationPreview: string
  mimetype: string
  originalname: string
  ownerKey: string
  size: number
  updatedAt: string
  userId: string
}

const ChatDetailsScreen = observer(({ route }: any) => {
  const { chatStore, loginStore, apiStore } = useStores()
  const currentRoomDetail = chatStore.getRoomDetails(
    route.params.roomJID
  ) as roomListProps

  const roomJID = currentRoomDetail?.jid
  const { isOpen, onOpen, onClose } = useDisclose()

  const [longTapUser, setLongTapUser] = useState<longTapUserProps>({
    ban_status: "",
    jid: "",
    last_active: "",
    name: "",
    profile: "",
    role: "",
  })
  const [kickUserItem, setKickUserItem] = useState<longTapUserProps>({
    ban_status: "",
    jid: "",
    last_active: "",
    name: "",
    profile: "",
    role: "",
  })

  const isOwnerOrModerator = chatStore.checkIsModerator(currentRoomDetail.jid)

  const [descriptionModalVisible, setDescriptionModalVisible] =
    useState<boolean>(false)
  const [isShowKickDialog, setIsShowKickDialog] = useState(false)

  const [roomNameModalVisible, setRoomNameModalVisible] =
    useState<boolean>(false)

  const handleCloseKickDialog = () => setIsShowKickDialog(false)
  const cancelRef = React.useRef(null)
  // const [isNotification, setIsNotification] = useState<boolean>(roomInfo.muted)

  const navigation = useNavigation<HomeStackNavigationProp>()

  const walletAddress = loginStore.initialData.walletAddress
  const manipulatedWalletAddress = underscoreManipulation(walletAddress)

  const unsubscribeFromRoom = () => {
    unsubscribeFromChatXmpp(manipulatedWalletAddress, roomJID, chatStore.xmpp)
    chatStore.updateRoomInfo(roomJID, { muted: true })
  }

  const subscribeRoom = () => {
    subscribeToRoom(roomJID, manipulatedWalletAddress, chatStore.xmpp)
    chatStore.updateRoomInfo(roomJID, { muted: false })
  }

  useEffect(() => {
    getRoomMemberInfo(manipulatedWalletAddress, roomJID, chatStore.xmpp)
    getRoomInfo(manipulatedWalletAddress, roomJID, chatStore.xmpp)
    getListOfBannedUserInRoom(manipulatedWalletAddress, roomJID, chatStore.xmpp)
  }, [])

  const toggleNotification = (value: boolean) => {
    value ? subscribeRoom() : unsubscribeFromRoom()
  }

  const leaveTheRoom = async () => {
    leaveRoomXmpp(
      manipulatedWalletAddress,
      roomJID,
      walletAddress,
      chatStore.xmpp
    )
    unsubscribeFromRoom()
    await deleteChatRoom(roomJID)
    chatStore.getRoomsFromCache()
    //@ts-ignore
    navigation.popToTop()
  }

  const deleteRoomDialog = async () => {
    Alert.alert("Delete", "Do you want to delete this room?", [
      {
        text: "Cancel",
        onPress: () => console.log("canceled"),
      },
      {
        text: "Yes",
        onPress: () => leaveTheRoom(),
      },
    ])
  }

  const toggleFavourite = () => {
    chatStore.updateRoomInfo(roomJID, {
      isFavourite: !chatStore.roomsInfoMap[roomJID]?.isFavourite,
    })
  }

  const onUserAvatarPress = (props: roomMemberInfoProps) => {
    //to set the current another user profile
    // otherUserStore.setUserData(firstName, lastName, avatar);
    const xmppID = props.jid.split("@")[0]
    const userWalletAddress = reverseUnderScoreManipulation(xmppID)
    if (userWalletAddress === loginStore.initialData.walletAddress) {
      navigation.navigate("ProfileScreen")
      return
    } else {
      chatStore.getOtherUserDetails({
        jid: props.jid,
        avatar: props.profile,
        name: props.name,
      })
      navigation.navigate("OtherUserProfileScreen", {
        walletAddress: userWalletAddress,
      })
    }
  }

  const handleMemberLongTap = (item: roomMemberInfoProps) => {
    if (isOwnerOrModerator) {
      setLongTapUser(item)
      onOpen()
    }
  }

  const handleLongTapMenu = (type: number) => {
    if (type === 0) {
      if (longTapUser.ban_status === "clear") {
        banUserr(
          manipulatedWalletAddress,
          longTapUser.jid,
          currentRoomDetail.jid,
          chatStore.xmpp
        )
      } else {
        unbanUser(
          manipulatedWalletAddress,
          longTapUser.jid,
          currentRoomDetail.jid,
          chatStore.xmpp
        )
      }
      getRoomMemberInfo(manipulatedWalletAddress, roomJID, chatStore.xmpp)
      onClose()
    }

    if (type === 1) {
      if (longTapUser.role === "none" || "participant") {
        assignModerator(
          manipulatedWalletAddress,
          longTapUser.jid,
          chatStore.xmpp
        )
      } else {
        unAssignModerator(
          manipulatedWalletAddress,
          longTapUser.jid,
          chatStore.xmpp
        )
      }
    }
  }

  const handleKickDialog = (item: roomMemberInfoProps) => {
    setKickUserItem(item)
    setIsShowKickDialog(true)
  }

  const handleKick = () => {
    if (kickUserItem.ban_status === "clear") {
      banUserr(
        manipulatedWalletAddress,
        kickUserItem.jid,
        currentRoomDetail.jid,
        chatStore.xmpp
      )
    } else {
      unbanUser(
        manipulatedWalletAddress,
        kickUserItem.jid,
        currentRoomDetail.jid,
        chatStore.xmpp
      )
    }
    getRoomMemberInfo(manipulatedWalletAddress, roomJID, chatStore.xmpp)
    handleCloseKickDialog()
  }

  const handleEditDesriptionPress = () => {
    isOwnerOrModerator && setDescriptionModalVisible(true)
  }

  const handleRoomNameEdit = () => {
    isOwnerOrModerator && setRoomNameModalVisible(true)
  }

  const [uploadedImage, setUploadedImage] = useState<IuploadedImage>({
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

  const sendFiles = async (data: any) => {
    const userJid =
      underscoreManipulation(loginStore.initialData.walletAddress) +
      "@" +
      apiStore.xmppDomains.DOMAIN
    const { jid, roomBackground } = currentRoomDetail
    try {
      const url = fileUpload
      const response = await uploadFiles(data, loginStore.userToken, url)
      const file = response.results[0]
      setUploadedImage(response.results[0])
      setRoomImage(
        userJid,
        jid,
        file.location,
        roomBackground ? roomBackground : "none",
        "icon",
        chatStore.xmpp
      )
    } catch (error) {
      console.log(error)
    }
  }

  const onImagePress = async () => {
    if (isOwnerOrModerator) {
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
  }

  const handleChangeDescription = (newDescription: string) => {
    setDescriptionModalVisible(false)
    changeRoomDescription(
      manipulatedWalletAddress,
      roomJID,
      newDescription,
      chatStore.xmpp
    )
  }

  const handleChangeRoomName = (newRoomName: string) => {
    setRoomNameModalVisible(false)
    renameTheRoom(
      manipulatedWalletAddress,
      currentRoomDetail.jid,
      {
        roomName: newRoomName,
      },
      chatStore.xmpp,
      chatStore.updateRoomInfo
    )
  }

  return (
    <View bg={"white"} flex={1}>
      <View justifyContent={"flex-start"}>
        <ChatDetailHeader
          deleteRoomDialog={deleteRoomDialog}
          toggleFavourite={toggleFavourite}
          currentRoomDetail={currentRoomDetail}
        />
      </View>
      <View flex={0.4} justifyContent={"center"}>
        <RoomDetailsCard
          room={{
            jid: currentRoomDetail.jid,
            name: currentRoomDetail.name,
            roomThumbnail: currentRoomDetail.roomThumbnail as string,
            roomBackground: currentRoomDetail.roomBackground as string,
          }}
          handleEditDesriptionPress={handleEditDesriptionPress}
          handleRoomNameEdit={handleRoomNameEdit}
          onImagePress={onImagePress}
          uploadedImage={uploadedImage}
          toggleNotification={toggleNotification}
        />
      </View>
      <View justifyContent={"center"} flex={0.6}>
        <ChatDetailMemebersList
          currentRoomDetail={currentRoomDetail}
          handleKickDialog={handleKickDialog}
          handleMemberLongTap={handleMemberLongTap}
          onUserAvatarPress={onUserAvatarPress}
        />
      </View>

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item
            onPress={() => handleLongTapMenu(0)}
            _text={{
              fontFamily: textStyles.mediumFont,
              color: "red.500",
            }}
          >
            {longTapUser.ban_status === "clear" ? "Ban" : "Unban"}
          </Actionsheet.Item>

          <Actionsheet.Item
            onPress={() => handleLongTapMenu(1)}
            _text={{
              fontFamily: textStyles.mediumFont,
            }}
          >
            {longTapUser.role === "none" || "participant"
              ? "Assign Moderator"
              : "Unassign Moderator"}
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>

      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isShowKickDialog}
        onClose={handleCloseKickDialog}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>
            <Text fontSize={hp("2%")} fontFamily={textStyles.boldFont}>
              {kickUserItem.ban_status === "clear"
                ? "Kick user"
                : "Un-Kick user"}
            </Text>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <Text fontSize={hp("1.5%")} fontFamily={textStyles.regularFont}>
              {kickUserItem.ban_status === "clear"
                ? "This will block the user from sending any messages to the room. You will be able to ‘un-kick’ them later."
                : "This will un-block the user."}
            </Text>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={handleCloseKickDialog}
                ref={cancelRef}
              >
                <Text fontSize={hp("1.5%")} fontFamily={textStyles.boldFont}>
                  Cancel
                </Text>
              </Button>
              <Button colorScheme="danger" onPress={handleKick}>
                <Text
                  fontSize={hp("1.5%")}
                  color={"white"}
                  fontFamily={textStyles.boldFont}
                >
                  {kickUserItem.ban_status === "clear" ? "Kick" : "Un-kick"}
                </Text>
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>

      <ChangeRoomDescriptionModal
        modalVisible={descriptionModalVisible}
        setModalVisible={setDescriptionModalVisible}
        currentDescription={chatStore.roomsInfoMap[roomJID]?.roomDescription}
        changeDescription={handleChangeDescription}
      />

      <ChangeRoomNameModal
        modalVisible={roomNameModalVisible}
        setModalVisible={setRoomNameModalVisible}
        currentRoomName={currentRoomDetail?.name}
        changeRoomName={handleChangeRoomName}
      />
    </View>
  )
})

export default ChatDetailsScreen
