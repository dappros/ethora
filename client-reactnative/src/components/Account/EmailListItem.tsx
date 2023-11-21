/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import * as React from "react"
import { Text, View, StyleSheet, TouchableOpacity } from "react-native"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import AntIcon from "react-native-vector-icons/AntDesign"
import Tooltip from "react-native-walkthrough-tooltip"
import { commonColors, textStyles } from "../../../docs/config"

interface EmailListItemProps {
  emailList: any
  tooltipVisible: boolean
  setTooltipVisible: any
  deleteEmail: any
}

const toolTipContentText =
  "Please check your inbox for the verification email and follow the instructions in the email to verify this email address."

const EmailListItem = (props: EmailListItemProps) => {
  const { emailList, tooltipVisible, setTooltipVisible, deleteEmail } = props

  const { email, verified } = emailList.item
  const index = emailList.index

  return (
    <View key={index} style={[styles.emailListComponentContainerStyle]}>
      <View style={styles.emailDisplayBoxContainer}>
        <Text style={styles.emailDisplayTextStyle}>{email}</Text>
      </View>
      <Tooltip
        backgroundColor="transparent"
        isVisible={tooltipVisible}
        content={
          <Text style={styles.tooltipTextStyle}>{toolTipContentText}</Text>
        }
        placement="top"
        onClose={() => setTooltipVisible(false)}
      >
        <TouchableOpacity
          disabled={verified}
          onPress={() => (!verified ? setTooltipVisible(true) : null)}
          style={verified ? styles.verifiedButton : styles.notVerifiedButton}
        >
          <Text
            style={[
              styles.verifiedStatusTextStyle,
              { fontSize: hp(!verified ? "0.98%" : "1.47%") },
            ]}
          >
            {verified ? "Verified" : "Verification Needed"}
          </Text>
        </TouchableOpacity>
      </Tooltip>

      <TouchableOpacity
        onPress={() => deleteEmail(email)}
        style={styles.iconContainer}
      >
        <AntIcon
          name="delete"
          size={hp("2.35%")}
          style={{ color: "#FF0E0E" }}
        />
      </TouchableOpacity>
    </View>
  )
}

export default EmailListItem

const styles = StyleSheet.create({
  emailListComponentContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  emailDisplayBoxContainer: {
    width: wp("66.66%"),
    borderWidth: 1,
    borderColor: commonColors.primaryColor,
    backgroundColor: commonColors.primaryColor + "26",
    height: hp("5%"),
    justifyContent: "center",
    padding: hp("1.23%"),
    margin: hp("1.23%"),
    borderRadius: hp("0.36%"),
  },
  emailDisplayTextStyle: {
    fontSize: hp("1.47%"),
    fontFamily: textStyles.lightFont,
    color: "#000000",
  },
  tooltipTextStyle: {
    fontSize: hp("1.23%"),
    color: "#121212",
    fontFamily: textStyles.lightFont,
  },
  verifiedButton: {
    width: wp("16.53%"),
    height: hp("3.32%"),
    borderRadius: hp("0.12%"),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#10813A",
  },
  notVerifiedButton: {
    width: wp("16.53%"),
    height: hp("3.32%"),
    borderRadius: hp("0.12%"),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF6004",
  },
  verifiedStatusTextStyle: {
    color: "#FFFFFF",
    fontSize: hp("1.477%"),
    fontFamily: textStyles.lightFont,
    textAlign: "center",
  },
  iconContainer: {
    height: hp("2.3%"),
    width: hp("2.3%"),
    margin: hp("1.23%"),
    justifyContent: "center",
    alignItems: "center",
  },
})
