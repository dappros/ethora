/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { Box, Checkbox, Divider, HStack, Text, View } from "native-base"
import React, { useEffect } from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import { TypingAnimation } from "react-native-typing-animation"
import { commonColors, textStyles } from "../../../docs/config"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

interface RenderChatFooterProps {
  fileUploadProgress: number
  setFileUploadProgress: any
  allowIsTyping: boolean
  isTyping: boolean
  composingUsername: string
  isEditing?: boolean
  replyUserName?: string
  replyMessage?: string
  closeReply?: any
  showAlsoSendInRoom?: boolean
  showInChannel?: boolean
  onTapMessageObject?: any
  setShowInChannel?: React.Dispatch<React.SetStateAction<boolean>>
  setIsEditing: (value: boolean) => void
}

const RenderChatFooter = (props: RenderChatFooterProps) => {
  const boxHeight = useSharedValue(0)
  const {
    fileUploadProgress,
    setFileUploadProgress,
    allowIsTyping,
    isTyping,
    composingUsername,
    isEditing,
    showInChannel,
    showAlsoSendInRoom,
    onTapMessageObject,
    setShowInChannel,
    setIsEditing,
  } = props
  const boxAnimation = useAnimatedStyle(() => {
    return {
      height: withTiming(boxHeight.value, { duration: 350 }),
    }
  })
  useEffect(() => {
    if (!!isTyping || !!fileUploadProgress) {
      boxHeight.value = hp("5.5%")
    } else if (!!isEditing) {
      boxHeight.value = hp("6%")
    } else {
      boxHeight.value = 0
    }

    return () => {}
  }, [isTyping, fileUploadProgress, isEditing])

  setTimeout(() => {
    if (fileUploadProgress === 100) {
      setFileUploadProgress(0)
    }
  }, 5000)

  return (
    <>
      <Animated.View style={[boxAnimation]}>
        <HStack height={hp("5.5%")} width={wp("100%")} bgColor={"transparent"}>
          <View
            accessibilityLabel="Now Typing"
            justifyContent={"flex-end"}
            bg={"transparent"}
            flex={0.6}
          >
            {allowIsTyping && isTyping ? (
              <HStack bg={"transparent"}>
                <View bg={"transparent"} marginRight={30}>
                  <TypingAnimation dotColor="grey" />
                </View>
                <Text
                  color={"black"}
                  fontFamily={textStyles.regularFont}
                  fontSize={hp("1.4%")}
                >
                  {composingUsername}
                </Text>
              </HStack>
            ) : null}
          </View>
          <View alignItems={"flex-start"} justifyContent={"center"} flex={0.4}>
            {fileUploadProgress ? (
              <Text
                color={"grey"}
                fontFamily={textStyles.regularFont}
                fontSize={hp("1.4%")}
              >
                Uploading: {fileUploadProgress}%
              </Text>
            ) : null}
          </View>
        </HStack>
      </Animated.View>
      {isEditing && (
        <View
          height={hp("6.1%")}
          justifyContent={"center"}
          bg={"white"}
          width={wp("100%")}
        >
          <HStack width={wp("100%")} alignItems={"center"}>
            <Box alignItems={"center"} flex={0.15}>
              <MaterialIcons
                color={commonColors.primaryColor}
                name="edit"
                size={hp("3%")}
              />
            </Box>
            <Box alignItems={"flex-start"} flex={0.7}>
              <Text
                color={commonColors.primaryColor}
                fontFamily={textStyles.boldFont}
              >
                Edit Message
              </Text>
              <Text numberOfLines={1}>{onTapMessageObject.text}</Text>
            </Box>
            <View alignItems={"center"} flex={0.15}>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <MaterialIcons name="close" size={hp("3%")} />
              </TouchableOpacity>
            </View>
          </HStack>
        </View>
      )}
      {showAlsoSendInRoom && (
        <>
          <Divider />
          <View margin={2} justifyContent="center">
            <Checkbox
              onChange={() =>
                setShowInChannel && setShowInChannel(!showInChannel)
              }
              value="show"
              isChecked={showInChannel}
              colorScheme="green"
            >
              Also send to room
            </Checkbox>
          </View>
        </>
      )}
    </>
  )
}

export default RenderChatFooter

const styles = StyleSheet.create({
  container: {},
})
