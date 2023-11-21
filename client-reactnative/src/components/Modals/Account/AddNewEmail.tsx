/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { Input, Text, View } from "native-base"
import * as React from "react"
import Modal from "react-native-modal"
import { commonColors, textStyles } from "../../../../docs/config"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native"

interface AddNewEmailModalProps {
  setNewEmail: any
  submitEmail: any
  loading: boolean
  setAddEmailActive: any
  onBackdropPress: any
  isVisible: boolean
}

const AddNewEmailModal = (props: AddNewEmailModalProps) => {
  const {
    setNewEmail,
    submitEmail,
    loading,
    setAddEmailActive,
    onBackdropPress,
    isVisible,
  } = props

  return (
    <Modal
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      onBackdropPress={onBackdropPress}
      isVisible={isVisible}
    >
      <View
        bg={"white"}
        height={hp("10%")}
        flexDir={"row"}
        borderRadius={8}
        alignItems={"center"}
      >
        <Input
          //   style={style.addEmailTextInputTextStyle}
          placeholder="Add Email"
          onChangeText={(email) => setNewEmail(email)}
          width={wp("66.66%")}
          borderWidth={1}
          borderColor={commonColors.primaryColor}
          backgroundColor={commonColors.primaryColor + "26"}
          height={hp("5%")}
          justifyContent="center"
          padding={hp("1.23%")}
          margin={hp("1.23%")}
          borderRadius={hp("0.36%")}
          color={"black"}
        />
        <TouchableOpacity onPress={submitEmail} style={styles.submitButton}>
          {loading ? (
            <ActivityIndicator
              animating={loading}
              size="small"
              color={"white"}
            />
          ) : (
            <Text
              fontSize={hp("1.47%")}
              color={"#FFFFFF"}
              fontFamily={textStyles.regularFont}
            >
              Submit
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

export default AddNewEmailModal

const styles = StyleSheet.create({
  iconContainer: {
    height: hp("2.3%"),
    width: hp("2.3%"),
    margin: hp("1.23%"),
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    width: wp("16.53%"),
    height: hp("4.31%"),
    borderRadius: hp("0.36%"),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: commonColors.primaryColor,
  },
})
