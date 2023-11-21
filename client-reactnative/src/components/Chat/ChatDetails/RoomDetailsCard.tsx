import { Box, HStack, Switch, Text, View } from "native-base"
import React, { useState } from "react"
import { Pressable, TouchableOpacity } from "react-native"
import { useStores } from "../../../stores/context"
import { commonColors, textStyles } from "../../../../docs/config"
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen"
import FastImage from "react-native-fast-image"
import AntIcon from "react-native-vector-icons/AntDesign"
import { IuploadedImage } from "../../../Screens/Chat/ChatDetailsScreen"

interface RoomDetailsCardProps {
  uploadedImage: IuploadedImage
  room: {
    jid: string
    name: string
    roomThumbnail: string
    roomBackground: string
  }
  onImagePress: () => Promise<void>
  handleRoomNameEdit: () => void
  handleEditDesriptionPress: () => void
  toggleNotification: (value: boolean) => void
}

const RoomDetailsCard = (props: RoomDetailsCardProps) => {
  //component props
  const {
    onImagePress,
    room,
    handleRoomNameEdit,
    handleEditDesriptionPress,
    toggleNotification,
    uploadedImage,
  } = props
  //component props

  //mob stores
  const { chatStore } = useStores()
  //mob stores

  //local variables
  const isOwnerOrModerator = chatStore.checkIsModerator(room.jid)
  //local variables

  return (
    <View margin={10} justifyContent="center" alignItems="center">
      <TouchableOpacity
        onPress={onImagePress}
        activeOpacity={isOwnerOrModerator ? 0.8 : 1}
      >
        <Box
          justifyContent={"center"}
          alignItems={"center"}
          borderRadius={10}
          shadow={"5"}
          bg={commonColors.primaryDarkColor}
          h={wp("22%")}
          w={wp("22%")}
          marginBottom={4}
        >
          {uploadedImage.location || room.roomThumbnail ? (
            <FastImage
              source={{
                uri: uploadedImage.location || room.roomThumbnail,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
              style={{
                width: wp("22%"),
                height: wp("22%"),
                borderRadius: 10,
              }}
            />
          ) : (
            <Text
              // shadow={'8'}
              fontSize={hp("6%")}
              fontFamily={textStyles.semiBoldFont}
              color={"white"}
            >
              {room.name ? room.name[0] : "No name"}
            </Text>
          )}
        </Box>
      </TouchableOpacity>

      <HStack alignItems={"center"}>
        <Text
          color={"black"}
          fontSize={hp("2.5%")}
          fontFamily={textStyles.boldFont}
        >
          {room.name ? room.name : "No name"}
        </Text>
        {isOwnerOrModerator && (
          <Pressable onPress={handleRoomNameEdit}>
            <AntIcon
              name="edit"
              color={isOwnerOrModerator ? commonColors.primaryColor : "grey"}
              size={hp("2%")}
            />
          </Pressable>
        )}
      </HStack>

      <Text
        color={"black"}
        textAlign={"center"}
        fontSize={hp("1.5%")}
        fontFamily={textStyles.regularFont}
      >
        {chatStore.roomsInfoMap[room.jid].roomDescription
          ? chatStore.roomsInfoMap[room.jid].roomDescription
          : "No description here"}
      </Text>
      {isOwnerOrModerator && (
        <Pressable onPress={handleEditDesriptionPress}>
          <AntIcon
            name="edit"
            color={isOwnerOrModerator ? commonColors.primaryColor : "grey"}
            size={hp("2%")}
          />
        </Pressable>
      )}

      <HStack marginTop={2} justifyContent={"flex-end"} alignItems="center">
        <Text
          fontFamily={textStyles.boldFont}
          fontSize={hp("2%")}
          color={commonColors.primaryColor}
        >
          Notifications
        </Text>
        <Switch
          isChecked={!chatStore.roomsInfoMap[room.jid].muted}
          onToggle={(args) => toggleNotification(args)}
          onTrackColor={commonColors.primaryColor}
          size={"sm"}
        />
      </HStack>
    </View>
  )
}

export default RoomDetailsCard
