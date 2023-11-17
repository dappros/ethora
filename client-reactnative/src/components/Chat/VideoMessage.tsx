/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { Box } from "native-base"
import React from "react"
import { StyleSheet, View } from "react-native"
import FastImage from "react-native-fast-image"
import { TouchableOpacity } from "react-native-gesture-handler"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { formatBytes } from "../../helpers/chat/formatBytes"
import { MessageSize } from "./MessageSize"
import AntIcon from "react-native-vector-icons/AntDesign"
interface VideoMessageProps {
  url: any
  size: any
  onLongPress?: () => void
  onPress: () => void
}

export const VideoMessage: React.FC<VideoMessageProps> = ({
  url,
  size,
  onLongPress,
  onPress,
}) => {
  const formatedSize = formatBytes(parseFloat(size), 2)

  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.button}
    >
      {size && (
        <MessageSize size={formatedSize.size + " " + formatedSize.unit} />
      )}
      <Box p={"1.5"} position={"relative"}>
        <FastImage style={styles.preview} source={{ uri: url }} />
        <View
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <AntIcon
            name="play"
            color={"rgba(255,255,255,0.8)"}
            size={50}
            style={{ margin: 5 }}
          />
        </View>
      </Box>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  preview: {
    width: hp("22%"),
    height: hp("22%"),
    borderRadius: 10,
    borderColor: "white",
  },
  button: {
    borderRadius: 5,
    justifyContent: "center",
    position: "relative",
  },
})
