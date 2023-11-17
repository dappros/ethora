/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { Text, View } from "native-base"
import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import { commonColors } from "../../../docs/config"
import { colors } from "../../constants/messageColors"
import { alpha } from "../../helpers/aplha"
import { underscoreManipulation } from "../../helpers/underscoreLogic"
import { useStores } from "../../stores/context"
import { sendMessageStanza } from "../../xmpp/stanzas"

interface IQuickReply {
  name: string
  value: string
  notDisplayedValue: string
}

interface IQuickReplies {
  quickReplies: IQuickReply[]
  roomJid: string
  roomName: string
  width: number
  messageAuthor: string
}

export const QuickReplies: React.FC<IQuickReplies> = ({
  quickReplies,
  roomJid,
  roomName,
  width,
  messageAuthor,
}) => {
  const { chatStore, loginStore } = useStores()
  const isSameUser =
    messageAuthor ===
    underscoreManipulation(loginStore.initialData.walletAddress)
  const onQuickReplyPress = ({
    name,
    value,
    notDisplayedValue,
  }: {
    name: string
    value: string
    notDisplayedValue: string
  }) => {
    const data = {
      senderFirstName: loginStore.initialData.firstName,
      senderLastName: loginStore.initialData.lastName,
      senderWalletAddress: loginStore.initialData.walletAddress,
      isSystemMessage: false,
      tokenAmount: 0,
      receiverMessageId: "",
      mucname: roomName,
      photoURL: loginStore.userAvatar,
      roomJid: roomJid,
      notDisplayedValue,
      push: true,
    }
    sendMessageStanza(
      underscoreManipulation(loginStore.initialData.walletAddress),
      roomJid,
      value,
      data,
      chatStore.xmpp
    )
  }
  return (
    <View
      alignItems={isSameUser ? "flex-end" : "flex-start"}
      style={{ marginVertical: 4 }}
      width={width}
    >
      {!!quickReplies &&
        quickReplies.map((item, i) => {
          return (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => onQuickReplyPress(item)}
              style={[
                styles.button,
                {
                  width: width - 60,
                  backgroundColor: isSameUser
                    ? alpha(commonColors.primaryColor, 0.3)
                    : alpha(colors.leftBubbleBackground, 0.4),
                },
              ]}
              key={i}
            >
              <Text color={"white"}>{item.name}</Text>
            </TouchableOpacity>
          )
        })}
    </View>
  )
}
const styles = StyleSheet.create({
  button: {
    borderRadius: 5,

    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 7,
    marginTop: 3,
  },
})
