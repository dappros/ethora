import React from "react"
import { Animated, StyleSheet, TouchableOpacity } from "react-native"
import { heightPercentageToDP } from "react-native-responsive-screen"
import { textStyles } from "../../../docs/config"

export interface IProfileTab {
  onPress: () => void
  isTabActive: boolean
  text: string
  accessibilityLabel?: string
}

export const ProfileTab: React.FC<IProfileTab> = ({
  isTabActive,
  text,
  onPress,
  accessibilityLabel,
}) => {
  return (
    <TouchableOpacity
      style={{ paddingHorizontal: 5 }}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
    >
      <Animated.Text
        style={[
          styles.tabText,
          {
            color: isTabActive ? "#000000" : "#0000004D",
          },
        ]}
      >
        {text}
      </Animated.Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  tabText: {
    fontSize: heightPercentageToDP("1.97%"),
    fontFamily: textStyles.boldFont,
  },
})
