import { Button, Input, Modal, Text } from "native-base"
import * as React from "react"
import { commonColors, textStyles } from "../../../../docs/config"
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen"

interface ChangeRoomNameModalProps {
  modalVisible: boolean
  setModalVisible: any
  currentRoomName: string
  changeRoomName: (newRoomName: string) => void
}

const ChangeRoomNameModal = (props: ChangeRoomNameModalProps) => {
  const { modalVisible, setModalVisible, currentRoomName, changeRoomName } =
    props

  const [newRoomName, setNewRoomName] = React.useState<string>(currentRoomName)

  return (
    <Modal onClose={() => setModalVisible(false)} isOpen={modalVisible}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Change Room Name</Modal.Header>
        <Modal.Body justifyContent={"center"} alignItems={"center"}>
          <Input
            onChangeText={(text) => setNewRoomName(text)}
            fontFamily={textStyles.lightFont}
            placeholder="new room name"
            clearTextOnFocus
            h={hp("5%")}
            focusOutlineColor={commonColors.primaryDarkColor}
          />
          <Button
            margin={2}
            onPress={() => changeRoomName(newRoomName)}
            bg={commonColors.primaryDarkColor}
            h={hp("5%")}
            w={wp("25%")}
          >
            <Text fontFamily={textStyles.boldFont} color="white">
              Change
            </Text>
          </Button>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  )
}

export default ChangeRoomNameModal
