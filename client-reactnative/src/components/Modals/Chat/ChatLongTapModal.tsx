import { View } from "native-base"
import React, { useState } from "react"
import { StyleSheet } from "react-native"
import Modal from "react-native-modal"
import { TokensOrItemsTransfer } from "../TransactionModal/TokensOrItemsTransfer"
import { ChatLongTapUserActions } from "./ChatLongTapUserActions"
import { IDataForTransfer } from "./types"

export interface IChatLongTapModal {
  open: boolean
  onClose: () => void
  dataForTransfer: IDataForTransfer
}

export const ChatLongTapModal: React.FC<IChatLongTapModal> = ({
  open,
  onClose,
  dataForTransfer,
}) => {
  const [isUserActionsHidden, setUserActionsHidden] = useState(false)

  const hideUserActions = () => {
    setUserActionsHidden(true)
  }

  const closeModal = () => {
    onClose()
    setUserActionsHidden(false)
  }
  return (
    <Modal
      onBackdropPress={closeModal}
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
      onDismiss={closeModal}
      isVisible={open}
    >
      <View
        shadow={"2"}
        borderRadius={"10"}
        pb={"1"}
        style={{
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TokensOrItemsTransfer
          closeModal={closeModal}
          hideUserActions={hideUserActions}
          dataForTransfer={dataForTransfer}
        />
        {!isUserActionsHidden && (
          <ChatLongTapUserActions
            closeModal={closeModal}
            dataForTransfer={dataForTransfer}
          />
        )}
      </View>
    </Modal>
  )
}

// const styles = StyleSheet.create({});
