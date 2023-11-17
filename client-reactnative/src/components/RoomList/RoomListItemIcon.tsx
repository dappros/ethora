/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React from "react"
import { textStyles } from "../../../docs/config"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { Box, Text, View } from "native-base"
import { observer } from "mobx-react-lite"
import { useStores } from "../../stores/context"
import FastImage from "react-native-fast-image"

export const RoomListItemIcon = observer(
  ({ name, jid }: { name: string; counter: number; jid: string }) => {
    const { chatStore } = useStores()
    const room = chatStore.roomList.find((item) => item.jid === jid)
    return (
      <View height={hp("9%")} width={hp("9%")} borderRadius={hp("4.5%")}>
        {room?.roomThumbnail ? (
          <FastImage
            source={{
              uri: room.roomThumbnail,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
            style={{
              borderRadius: hp("4.5%"),
              width: "100%",
              height: "100%",
            }}
          />
        ) : (
          <Box
            backgroundColor={"#0052CD"}
            borderRadius={hp("4.5%")}
            width={"100%"}
            height={"100%"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Text
              style={{
                color: "white",
                marginRight: 3,
                fontFamily: textStyles.boldFont,
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              {name && name[0] + (name[1] ? name[1] : "")}
            </Text>
          </Box>
        )}
      </View>
    )
  }
)
