import * as React from "react"
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen"
import { Button, Input, Modal, Text } from "native-base"
import { commonColors, textStyles } from "../../../../docs/config"

interface ChangeUserDescriptionModalProps {
  modalVisible: boolean
  setModalVisible: any
  currentDescription: string
  changeDescription: any
}

const ChangeUserDescriptionModal = (props: ChangeUserDescriptionModalProps) => {
  const {
    modalVisible,
    setModalVisible,
    currentDescription,
    changeDescription,
  } = props

  const [newDescription, setNewDescription] =
    React.useState<string>(currentDescription)
  return (
    <Modal onClose={() => setModalVisible(false)} isOpen={modalVisible}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Change Room Description</Modal.Header>
        <Modal.Body justifyContent={"center"} alignItems={"center"}>
          <Input
            onChangeText={(text) => setNewDescription(text)}
            fontFamily={textStyles.lightFont}
            placeholder="new description"
            clearTextOnFocus
            focusOutlineColor={commonColors.primaryDarkColor}
          />
          <Button
            margin={2}
            onPress={() => changeDescription(newDescription)}
            bg={commonColors.primaryDarkColor}
            display={"flex"}
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

export default ChangeUserDescriptionModal
