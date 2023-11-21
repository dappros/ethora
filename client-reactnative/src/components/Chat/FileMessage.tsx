/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { Box } from "native-base"
import React from "react"
import FastImage from "react-native-fast-image"
import { TouchableOpacity } from "react-native-gesture-handler"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { formatBytes } from "../../helpers/chat/formatBytes"
import { MessageSize } from "./MessageSize"

interface FileMessageProps {
  url: string
  size: string
  onLongPress?: () => void
  onPress: () => void
}

export const FileMessage = ({
  size,
  onLongPress,
  onPress,
}: FileMessageProps) => {
  const formatedSize = formatBytes(parseFloat(size), 2)
  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        borderRadius: 5,
        justifyContent: "center",
        position: "relative",
      }}
    >
      {size && (
        <MessageSize size={formatedSize.size + " " + formatedSize.unit} />
      )}
      <Box p={"1.5"}>
        <FastImage
          style={{
            width: hp("22%"),
            height: hp("22%"),
            borderRadius: 10,
            borderColor: "white",
          }}
          source={require("../../assets/fileIcon.png")}
        />
      </Box>
    </TouchableOpacity>
  )
}
