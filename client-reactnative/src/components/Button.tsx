import React from "react"
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"

import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { commonColors, textStyles } from "../../docs/config"

interface ButtonProps {
  loading?: boolean
  onPress: () => void
  title: string
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  loading,
  onPress,
  title,
  style,
  textStyle,
  disabled,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      accessibilityLabel={title}
      style={[styles.submitButton, style]}
    >
      <View
        style={{
          alignItems: "center",
        }}
      >
        <Text style={[styles.submitButtonText, textStyle]}>
          {loading ? <ActivityIndicator color={"white"} size={30} /> : title}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: commonColors.primaryColor,
    paddingVertical: 5,
    paddingHorizontal: 10,

    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  submitButtonText: {
    fontSize: hp("1.5%"),
    color: "#FFFFFF",
    fontFamily: textStyles.mediumFont,
  },
})
