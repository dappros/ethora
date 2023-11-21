/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React, { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native"

import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import Modal from "react-native-modal"

import { Input } from "native-base"
import { commonColors, textStyles } from "../../../../docs/config"

export const UserNameModal = ({
  closeModal,
  modalVisible,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  onSubmit,
}: {
  modalVisible: boolean
  firstName: string
  lastName: string
  closeModal: () => void
  setFirstName: (text: string) => void
  setLastName: (text: string) => void
  onSubmit: () => Promise<any>
}) => {
  const [loading, setLoading] = useState(false)
  const submit = async () => {
    setLoading(true)
    await onSubmit()
    setLoading(false)
  }
  return (
    <Modal onBackdropPress={closeModal} isVisible={modalVisible}>
      <View style={styles.modal}>
        <Input
          maxLength={15}
          marginBottom={2}
          fontFamily={textStyles.lightFont}
          fontSize={hp("1.6%")}
          color={"black"}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter your first name"
          placeholderTextColor={commonColors.primaryColor}
        />
        <Input
          maxLength={15}
          fontFamily={textStyles.lightFont}
          fontSize={hp("1.6%")}
          color={"black"}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter your last name"
          placeholderTextColor={commonColors.primaryColor}
        />
        <TouchableOpacity
          disabled={loading}
          style={styles.submitButton}
          onPress={submit}
        >
          {loading ? (
            <ActivityIndicator size={20} color={"white"} />
          ) : (
            <Text style={{ color: "white" }}>Register</Text>
          )}
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: commonColors.primaryDarkColor,
    width: 150,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
})
