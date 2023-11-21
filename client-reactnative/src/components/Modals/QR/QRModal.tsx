import { HStack, Text, View, Pressable } from "native-base"
import React from "react"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { textStyles } from "../../../../docs/config"
import QRCodeGenerator from "../../QRCodeGenerator"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import Modal from "react-native-modal"

export interface IQRModal {
  open: boolean
  onClose: () => void
  removeBaseUrl?: boolean
  link: string
  title: string
}

export const QRModal: React.FC<IQRModal> = ({
  open,
  onClose,
  link,
  removeBaseUrl,
  title,
}) => {
  return (
    <Modal
      onBackdropPress={onClose}
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      isVisible={open}
    >
      <View
        w={wp("90%")}
        h={wp("100%")}
        bg={"#ffff"}
        shadow="2"
        borderRadius={10}
        padding={2}
      >
        <HStack>
          <View padding={2} flex={0.5}>
            <Text
              fontFamily={textStyles.boldFont}
              fontSize={hp("2.2%")}
              color={"#000"}
            >
              Share {title}
            </Text>
          </View>
          <Pressable
            padding={2}
            flex={0.5}
            alignItems={"flex-end"}
            onPress={onClose}
          >
            <MaterialIcons name="close" color={"black"} size={hp("3.5%")} />
          </Pressable>
        </HStack>
        <View style={{ flex: 1 }}>
          <QRCodeGenerator
            removeBaseUrl={removeBaseUrl || false}
            close={onClose}
            shareKey={link}
          />
        </View>
      </View>
    </Modal>
  )
}
