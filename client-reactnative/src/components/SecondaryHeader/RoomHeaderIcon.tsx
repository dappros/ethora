/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React from "react";
import { textStyles } from "../../../docs/config";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Box, Text, View } from "native-base";
import { observer } from "mobx-react-lite";
import { useStores } from "../../stores/context";
import FastImage from "react-native-fast-image";
import { TouchableOpacity } from "react-native";

export const RoomHeaderIcon = observer(
  ({
    name,
    jid,
    onClick,
  }: {
    name: string;
    jid: string;
    onClick: () => void;
  }) => {
    const { chatStore } = useStores();
    const room = chatStore.roomList.find((item) => item.jid === jid);

    const handleClick = () => {
      onClick?.();
    };

    return (
      <TouchableOpacity onPress={handleClick}>
        {room?.roomThumbnail ? (
          <FastImage
            source={{
              uri: room.roomThumbnail,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
            style={{
              borderRadius: hp("4.5%"),
              width: 48,
              height: 48,
            }}
          />
        ) : (
          <Box
            style={{
              borderColor: "#8F8F8F",
              borderWidth: 1,
              borderRadius: hp("4.5%"),
              width: 48,
              height: 48,
              backgroundColor: "#0052CD",
            }}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Text
              style={{
                color: "white",
                fontFamily: textStyles.boldFont,
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              {name && name[0] + (name[1] ? name[1] : "")}
            </Text>
          </Box>
        )}
      </TouchableOpacity>
    );
  }
);
