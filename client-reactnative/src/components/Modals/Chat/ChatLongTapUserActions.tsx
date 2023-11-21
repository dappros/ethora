import React from "react"
import { Alert, StyleSheet, Text, View } from "react-native"
import { commonColors } from "../../../../docs/config"
import ReportAndBlockButton from "../TransactionModal/ReportAndBlockButton"
import { TransferModalButton } from "../TransactionModal/TransferModalButton"
import { widthPercentageToDP as wp } from "react-native-responsive-screen"
import { Seperator } from "../../Separator"
import { useStores } from "../../../stores/context"
import { underscoreManipulation } from "../../../helpers/underscoreLogic"
import {
  createNewRoom,
  setOwner,
  roomConfig,
  subscribeToRoom,
  sendInvite,
  banUser,
  blacklistUser,
} from "../../../xmpp/stanzas"
import { useNavigation } from "@react-navigation/native"
import { IDataForTransfer } from "./types"
import { HomeStackNavigationProp } from "../../../navigation/types"

export interface IChatLongTapUserActions {
  dataForTransfer: IDataForTransfer
  closeModal: () => void
}

export const ChatLongTapUserActions: React.FC<IChatLongTapUserActions> = ({
  dataForTransfer,
  closeModal,
}) => {
  const { chatStore, loginStore, apiStore } = useStores()
  const navigation = useNavigation<HomeStackNavigationProp>()

  const onDirectMessagePress = async () => {
    const otherUserWalletAddress = dataForTransfer?.walletFromJid
    const myWalletAddress = loginStore.initialData.walletAddress
    const combinedWalletAddress = [myWalletAddress, otherUserWalletAddress]
      .sort()
      .join("_")

    const roomJid =
      combinedWalletAddress.toLowerCase() +
      apiStore.xmppDomains.CONFERENCEDOMAIN
    const combinedUsersName = [
      loginStore.initialData.firstName,
      dataForTransfer.name.split(" ")[0],
    ]
      .sort()
      .join(" and ")

    const myXmppUserName = underscoreManipulation(myWalletAddress)
    createNewRoom(
      myXmppUserName,
      combinedWalletAddress.toLowerCase(),
      chatStore.xmpp
    )
    setOwner(
      myXmppUserName,
      combinedWalletAddress.toLowerCase(),
      chatStore.xmpp
    )
    roomConfig(
      myXmppUserName,
      combinedWalletAddress.toLowerCase(),
      { roomName: combinedUsersName, roomDescription: "" },
      chatStore.xmpp
    )
    subscribeToRoom(roomJid, myXmppUserName, chatStore.xmpp)

    navigation.navigate("ChatScreen", {
      chatJid: roomJid,
      chatName: combinedUsersName,
    })
    chatStore.toggleShouldCount(false)
    closeModal()
    setTimeout(() => {
      sendInvite(
        underscoreManipulation(myWalletAddress),
        roomJid.toLowerCase(),
        underscoreManipulation(otherUserWalletAddress),
        chatStore.xmpp
      )
    }, 3000)
  }

  const handleBanUser = (name: string, senderName: string) => {
    const bannedUserWalletAddres = underscoreManipulation(
      dataForTransfer?.walletFromJid
    )
    const senderWalletAddres = underscoreManipulation(
      loginStore.initialData.walletAddress
    )
    const roomJID = dataForTransfer.chatJid

    Alert.alert("Kick", `Kick ${name} from this room?`, [
      {
        text: "Cancel",
        onPress: () => {
          closeModal()
        },
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          banUser(
            roomJID,
            senderWalletAddres,
            bannedUserWalletAddres,
            chatStore.xmpp
          )
          chatStore.setUserBanData(senderName, name)
          closeModal()
        },
      },
    ])
  }
  const onBlackListPress = () => {
    const bannedUserWalletAddres = underscoreManipulation(
      dataForTransfer?.walletFromJid
    )
    const senderWalletAddres = underscoreManipulation(
      loginStore.initialData.walletAddress
    )

    blacklistUser(senderWalletAddres, bannedUserWalletAddres, chatStore.xmpp)
    closeModal()
  }
  return (
    <>
      <TransferModalButton
        title={"Direct Message"}
        onPress={onDirectMessagePress}
      />
      {chatStore.roomRoles[dataForTransfer.chatJid] !== "participant" && (
        <View style={{ width: wp("70%"), alignItems: "center" }}>
          <Seperator />
          <ReportAndBlockButton
            onPress={() =>
              handleBanUser(dataForTransfer.name, dataForTransfer.senderName)
            }
            text={"Kick this user"}
            style={{ backgroundColor: "#a32f2b" }}
          />
          <Text style={styles.removeUser}>Remove user from this room.</Text>
        </View>
      )}
      <View style={{ width: wp("70%"), alignItems: "center" }}>
        <Seperator />
        <ReportAndBlockButton
          onPress={onBlackListPress}
          text={"Block this user"}
          style={{ backgroundColor: commonColors.primaryColor }}
        />

        <Text style={styles.stopSeeUser}>Stop seeing this user.</Text>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  stopSeeUser: {
    fontSize: 10,
    textAlign: "center",
    lineHeight: 10,
    // marginTop: 5,
    paddingHorizontal: 1,
    color: "#5A5A5A",
  },
  removeUser: {
    fontSize: 10,
    textAlign: "center",
    lineHeight: 10,
    // marginTop: 5,
    color: "#5A5A5A",
  },
})
