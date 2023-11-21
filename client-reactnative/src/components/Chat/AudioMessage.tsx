/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import Svg, { Rect } from "react-native-svg"
import { commonColors } from "../../../docs/config"
import AntDesign from "react-native-vector-icons/AntDesign"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { HStack } from "native-base"
import { IMessage } from "../../stores/chatStore"

//interfaces and types
interface IAudioMessage {
  onLongPress: (message: IMessage) => void
  onPress: () => void
  waveform: Array<number>
  message: IMessage
}
//interfaces and types

//UI Component for messages with audio files
export const AudioMessage: React.FC<IAudioMessage> = ({
  onLongPress,
  onPress,
  waveform,
  message,
}) => {
  return (
    <TouchableOpacity
      accessibilityLabel="Play Audio Message"
      onLongPress={() => onLongPress(message)}
      onPress={() => onPress()}
      activeOpacity={0.7}
      style={styles.button}
    >
      <HStack
        alignItems={"center"}
        style={{
          marginTop: 10,
        }}
      >
        <AntDesign
          name="play"
          size={hp("3%")}
          color={"white"}
          style={{
            marginRight: 4,
            marginLeft: 10,
          }}
        />
        {!!waveform && typeof waveform === "object" && (
          <Svg stroke={commonColors.primaryDarkColor} width={100} height={55}>
            {waveform?.map((item, i) => (
              <Rect
                fill={"rgba(255,255,255,0.9)"}
                key={i}
                width={3}
                x={i * 4}
                y={35 + item}
                height={item === 0 ? -3 : -item * 25}
              />
            ))}
          </Svg>
        )}
      </HStack>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    height: hp("5%"),
    justifyContent: "center",
    position: "relative",
  },
})
