import React from "react"
import { StyleSheet, View } from "react-native"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
export const Seperator = () => {
  return <View style={styles.seperator} />
}

const styles = StyleSheet.create({
  seperator: {
    width: wp("40%"),
    height: 0,
    borderWidth: 1,
    borderColor: "#A1A1A1",
    margin: hp("1.5%"),
  },
})
