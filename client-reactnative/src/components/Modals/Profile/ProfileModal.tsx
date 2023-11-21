/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { Input, View, Text, TextArea, KeyboardAvoidingView } from "native-base"
import * as React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import Modal from "react-native-modal"
import { commonColors, textStyles } from "../../../../docs/config"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"

interface ProfileModalProps {
  isVisible: boolean
  onBackdropPress: any
  modalType: "name" | "description" | ""
  isDescriptionEditable: boolean
  description: string
  onDescriptionChange: any
  setDescription: any
  firstName: string
  lastName: string
  onNameChange: any
  setNewName: any
}

const ProfileModal = (props: ProfileModalProps) => {
  const {
    isVisible,
    onBackdropPress,
    modalType,
    isDescriptionEditable,
    description,
    onDescriptionChange,
    setDescription,
    firstName,
    lastName,
    onNameChange,
    setNewName,
  } = props

  const modalContent = () => {
    if (modalType === "description") {
      return isDescriptionEditable ? (
        <View
          justifyContent="space-evenly"
          alignItems="center"
          backgroundColor="white"
          borderRadius={8}
          height={hp("30%")}
        >
          <TextArea
            margin={5}
            maxLength={128}
            fontFamily={textStyles.lightFont}
            fontSize={hp("1.6%")}
            color={"black"}
            value={description}
            onChangeText={(text) => onDescriptionChange(text)}
            placeholder="Enter your description"
            placeholderTextColor={commonColors.primaryColor}
            autoCompleteType={undefined}
          />

          <TouchableOpacity
            onPress={setDescription}
            style={{
              backgroundColor: commonColors.primaryColor,
              borderRadius: 5,
              height: hp("4.3"),
              padding: 4,
            }}
          >
            <View justifyContent="center" alignItems="center" flex={1}>
              <Text
                fontSize={hp("2%")}
                color="#fff"
                fontFamily={textStyles.regularFont}
              >
                Done editing
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : null
    }

    if (modalType === "name") {
      return (
        <View
          justifyContent={"center"}
          alignItems="center"
          backgroundColor="white"
          borderRadius={8}
          height={hp("30%")}
        >
          <Input
            margin={5}
            maxLength={15}
            fontFamily={textStyles.lightFont}
            fontSize={hp("1.6%")}
            color={"black"}
            value={firstName}
            onChangeText={(text) => onNameChange("firstName", text)}
            placeholder="Enter your firstname"
            placeholderTextColor={commonColors.primaryColor}
          />

          <Input
            margin={5}
            maxLength={15}
            fontFamily={textStyles.lightFont}
            fontSize={hp("1.6%")}
            color={"black"}
            value={lastName}
            onChangeText={(text) => onNameChange("lastName", text)}
            placeholder="Enter your lastname"
            placeholderTextColor={commonColors.primaryColor}
          />

          <TouchableOpacity
            onPress={setNewName}
            style={{
              backgroundColor: commonColors.primaryColor,
              borderRadius: 5,
              height: hp("4.3"),
              padding: 4,
            }}
          >
            <View justifyContent="center" alignItems="center" flex={1}>
              <Text
                fontSize={hp("2%")}
                color="#fff"
                fontFamily={textStyles.regularFont}
              >
                Done editing
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
  }

  return (
    <Modal
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      avoidKeyboard
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
    >
      <View>{modalContent()}</View>
    </Modal>
  )
}

export default ProfileModal

const styles = StyleSheet.create({
  container: {},
})
