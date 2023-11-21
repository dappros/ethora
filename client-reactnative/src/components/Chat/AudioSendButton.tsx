import React from "react"
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native"
import { RecordingSecondsCounter } from "../Recorder/RecordingSecondsCounter"
import Entypo from "react-native-vector-icons/Entypo"
import { commonColors } from "../../../docs/config"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"

interface IAudioSendButton {
  onPressIn: () => void
  onPressOut: () => void
  recording: boolean
}
export const AudioSendButton: React.FC<IAudioSendButton> = ({
  onPressIn,
  onPressOut,
  recording,
}) => {
  //   const animateMediaButtonStyle = {
  //     transform: [{scale: mediaButtonAnimation}],
  //   };
  return (
    <View
      style={styles.recordingState}
      accessibilityLabel="Hold to record audio message"
    >
      <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut}>
        <Animated.View
          style={[
            styles.animated,
            //   animateMediaButtonStyle,
          ]}
        >
          <Entypo name="mic" color={"white"} size={hp("3%")} />
        </Animated.View>
      </TouchableWithoutFeedback>
      {recording && (
        <View style={{ position: "absolute", right: hp("10%") }}>
          <RecordingSecondsCounter />
        </View>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  normalButtonState: {
    backgroundColor: commonColors.primaryDarkColor,
    borderRadius: 100,
    padding: 5,
    marginRight: 5,
    paddingLeft: 7,
    marginBottom: 5,
  },
  recordingState: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: 5,
    flexDirection: "row",
    position: "relative",
  },
  animated: {
    backgroundColor: commonColors.primaryDarkColor,
    borderRadius: 50,
    padding: 5,
  },
})
