import React from "react"
import { Platform, StyleSheet } from "react-native"
import Modal from "react-native-modal"
import QRCodeScanner from "react-native-qrcode-scanner"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"

export interface IScanQrModal {
  closeModal: () => void
  open: boolean
  onSuccess: (e: any) => void
}

export const ScanQrModal: React.FC<IScanQrModal> = ({
  open,
  closeModal,
  onSuccess,
}) => {
  return (
    <Modal onBackdropPress={closeModal} isVisible={open}>
      <QRCodeScanner
        showMarker={true}
        cameraStyle={styles.cameraStyle}
        bottomViewStyle={{ flex: 1 }}
        onRead={onSuccess}
      />
    </Modal>
  )
}

const styles = StyleSheet.create({
  cameraStyle: {
    flex: Platform.OS === "android" ? 0.8 : 1,
    height: hp("40%"),
    width: "100%",
    justifyContent: "flex-start",
  },
})
