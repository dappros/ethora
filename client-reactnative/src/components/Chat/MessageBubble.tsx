/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React, { useState } from "react"
import {
  StyleSheet,
  Image,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native"
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen"
import { colors } from "../../constants/messageColors"
import { MessageImage, Time } from "react-native-gifted-chat"
import { coinImagePath, commonColors, textStyles } from "../../../docs/config"
import { QuickReplies } from "./QuickReplies"
import { MessageText } from "./MessageText"
import { Box, HStack, Text, View } from "native-base"
import { observer } from "mobx-react-lite"
import { containerType } from "./ChatContainer"
import { IMessage, roomListProps } from "../../stores/chatStore"
import { isSameDay, isSameUser } from "../../helpers/chat/chatUtils"
import { useStores } from "../../stores/context"

// const {isSameUser, isSameDay, StylePropType} = utils;

interface BubbleProps {
  onLongPress: any
  currentMessage: IMessage
  onTap: (message: IMessage) => void
  containerStyle?: any
  wrapperStyle?: any
  messageTextStyle?: any
  messageTextProps?: any
  renderMessageText?: any
  renderMessageImage?: any
  renderTicks?: any
  user: any
  tickStyle?: any
  renderUsername?: any
  renderTime?: any
  position: "left" | "right"
  renderCustomView?: any
  nextMessage?: any
  containerToNextStyle?: any
  previousMessage?: any
  containerToPreviousStyle?: any
  isCustomViewBottom?: any
  image?: any
  bottomContainerStyle?: any
  touchableProps?: any
  timeProps?: any
  usernameProps?: any
  messageImageProps?: any
  containerType: containerType
  scrollToParentMessage: any
  handleReply: (message: any) => void
}

const Bubble = observer((props: BubbleProps) => {
  const { chatStore } = useStores()
  const [width, setWidth] = useState(0)

  const {
    onLongPress,
    currentMessage,
    onTap,
    containerStyle,
    wrapperStyle,
    messageTextStyle,
    messageTextProps,
    renderMessageText,
    renderMessageImage,
    renderUsername,
    renderTime,
    position,
    renderCustomView,
    nextMessage,
    containerToNextStyle,
    previousMessage,
    containerToPreviousStyle,
    isCustomViewBottom,
    bottomContainerStyle,
    timeProps,
    usernameProps,
    messageImageProps,
    scrollToParentMessage,
    handleReply,
  } = props

  const room: roomListProps = chatStore.roomList.find(
    (item) => item.jid === currentMessage.roomJid
  ) || {
    avatar: "",
    counter: 0,
    createdAt: "",
    jid: currentMessage.roomJid,
    lastUserName: "",
    lastUserText: "",
    name: "",
    participants: 0,
    isFavourite: false,
    muted: false,
    priority: 0,
    roomBackground: "",
    roomBackgroundIndex: 0,
    roomThumbnail: "",
  }

  const onLongPressHandle = () => {
    if (onLongPress) {
      onLongPress(currentMessage)
    }
  }

  const onPressMessage = () => {
    onTap(currentMessage)
  }

  const renderMessageTextHandle = () => {
    if (currentMessage.text) {
      if (renderMessageText) {
        return renderMessageText(messageTextProps)
      }
      return (
        <MessageText
          {...props}
          textStyle={{
            left: [styles.content.userTextStyleLeft, messageTextStyle],
            right: [styles.content.userTextStyleLeft],
          }}
        />
      )
    }
    return null
  }

  const renderMessageImageHandle = () => {
    if (currentMessage.image || currentMessage.realImageURL) {
      if (renderMessageImage) {
        return renderMessageImage(props)
      }
      return (
        <MessageImage
          {...messageImageProps}
          imageStyle={[messageImageProps.imageStyle]}
        />
      )
    }
    return null
  }

  // const renderTicksHandle = () => {
  //   if (renderTicks) {
  //     return renderTicks(currentMessage);
  //   }
  //   if (currentMessage.user._id !== user._id) {
  //     return null;
  //   }
  //   if (currentMessage.sent || currentMessage.received) {
  //     return (
  //       <View style={[styles.headerItem, styles.tickView]}>
  //         {currentMessage.sent && (
  //           <Text style={[styles.standardFont, styles.tick, tickStyle]}>✓</Text>
  //         )}
  //         {currentMessage.received && (
  //           <Text style={[styles.standardFont, styles.tick, tickStyle]}>✓</Text>
  //         )}
  //       </View>
  //     );
  //   }
  //   return null;
  // };

  const renderUsernameHandle = () => {
    const username = currentMessage.user.name
    if (username) {
      if (renderUsername) {
        return renderUsername(usernameProps)
      }
      return (
        <View style={styles.content.usernameView}>
          <Text
            color={"white"}
            fontSize={hp("2%")}
            fontFamily={textStyles.lightFont}
          >
            {username}
          </Text>
        </View>
      )
    }
    return null
  }

  const renderTimeHandle = () => {
    if (currentMessage.createdAt) {
      if (renderTime) {
        return renderTime(timeProps)
      }
      return (
        //@ts-ignore
        <Time
          {...props}
          timeTextStyle={{
            left: {
              fontFamily: textStyles.lightFont,
            },
            right: {
              fontFamily: textStyles.lightFont,
            },
          }}
        />
      )
    }
    return null
  }

  const renderTokenCount = () => {
    if (currentMessage.tokenAmount) {
      return (
        <View style={[styles[position].tokenContainerStyle]}>
          <Text style={[styles[position].tokenTextStyle]}>
            {currentMessage.tokenAmount}
          </Text>
          <Image
            source={coinImagePath}
            resizeMode={"contain"}
            style={styles[position].tokenIconStyle}
          />
        </View>
      )
    }
  }
  const renderReplyCount = () => {
    if (currentMessage.numberOfReplies) {
      const replyConst =
        currentMessage.numberOfReplies > 1 ? "replies" : "reply"
      let text = " reply"
      if (currentMessage.numberOfReplies > 1) {
        text = " replies"
      }
      return (
        <HStack style={styles[position].numberOfRepliesContainerStyle}>
          <TouchableOpacity onPress={() => handleReply(currentMessage)}>
            <Text
              fontFamily={textStyles.regularFont}
              color={commonColors.primaryColor}
            >
              {currentMessage.numberOfReplies} {replyConst} (tap to review)
            </Text>
          </TouchableOpacity>
        </HStack>
      )
    }
  }
  const renderQuickReplies = () => {
    if (currentMessage.quickReplies && width) {
      let quickReplies = []
      try {
        quickReplies = JSON.parse(currentMessage.quickReplies)
      } catch (error) {
        console.log(error, "cannot parse quick replies")
      }
      return (
        <QuickReplies
          quickReplies={quickReplies}
          roomJid={currentMessage.roomJid}
          roomName={room.name}
          width={width}
          messageAuthor={currentMessage.user._id.split("@")[0]}
        />
      )
    }
  }

  const renderCustomViewHandle = () => {
    if (renderCustomView) {
      return renderCustomView(props)
    }
    return null
  }

  const styledBubbleToNext = () => {
    if (
      currentMessage &&
      nextMessage &&
      position &&
      isSameUser(currentMessage, nextMessage) &&
      isSameDay(currentMessage, nextMessage)
    ) {
      return [
        styles[position].containerToNext,
        containerToNextStyle && containerToNextStyle[position],
      ]
    }
    return null
  }

  const styledBubbleToPrevious = () => {
    if (
      currentMessage &&
      previousMessage &&
      position &&
      isSameUser(currentMessage, previousMessage) &&
      isSameDay(currentMessage, previousMessage)
    ) {
      return [
        styles[position].containerToPrevious,
        containerToPreviousStyle && containerToPreviousStyle[position],
      ]
    }
    return null
  }

  const renderBubbleContent = () => {
    return isCustomViewBottom ? (
      <View>
        {renderMessageImageHandle()}
        {!currentMessage.image && renderMessageTextHandle()}

        {renderCustomViewHandle()}
      </View>
    ) : (
      <View>
        {renderCustomViewHandle()}
        {renderMessageImageHandle()}
        {!currentMessage.image && renderMessageTextHandle()}
      </View>
    )
  }

  const setBubbleWidth = (width: any) => {
    setWidth(width)
  }

  const AnimatedStyle = {
    backgroundColor:
      position === "left" ? colors.leftBubbleBackground : colors.defaultBlue,
  }

  const replyComponent = () => {
    return currentMessage.isReply ? (
      <TouchableOpacity onPress={() => scrollToParentMessage(currentMessage)}>
        <HStack
          style={styles[position].replyWrapper}
          alignItems={"center"}
          justifyContent={"flex-start"}
          minH={hp("6%")}
          w="100%"
          bg={"white"}
        >
          <View
            margin={2}
            borderRadius={5}
            height={hp("4%")}
            width={wp("2%")}
            bg={
              position === "left"
                ? colors.leftBubbleBackground
                : colors.defaultBlue
            }
          />
          <View justifyContent={"center"}>
            <Text fontSize={hp("1.5%")} fontFamily={textStyles.boldFont}>
              {currentMessage.mainMessage?.userName || "N/A"}
            </Text>
            {currentMessage.mainMessage?.imagePreview ? (
              <Image
                source={{ uri: currentMessage.mainMessage.imagePreview }}
                style={{
                  height: hp("10%"),
                  width: hp("10%"),
                }}
              />
            ) : null}
            {!currentMessage.mainMessage?.imagePreview && (
              <Text fontSize={hp("1.5%")} fontFamily={textStyles.mediumFont}>
                {currentMessage?.mainMessage?.text}
              </Text>
            )}
            <Text color={"blue.100"}>{currentMessage.showInChannel}</Text>
          </View>
        </HStack>
      </TouchableOpacity>
    ) : null
  }

  const isEditedComponent = () => {
    return (
      <Box
        style={styles[position ? position : "left"].editWraper}
        alignItems={"flex-end"}
      >
        <Text
          fontFamily={textStyles.lightFont}
          fontSize={hp("1.2%")}
          color={"white"}
        >
          edited
        </Text>
      </Box>
    )
  }

  return (
    <View
      accessibilityLabel="Message Menu"
      onLayout={(e) => setBubbleWidth(e.nativeEvent.layout.width)}
      style={[
        styles[position].container,
        containerStyle && containerStyle[position],
        { position: "relative" },
      ]}
    >
      <Animated.View
        style={[
          styles[position].wrapper,
          styledBubbleToNext(),
          styledBubbleToPrevious(),
          wrapperStyle && wrapperStyle[position],
          AnimatedStyle,
          // {maxWidth: 200}
        ]}
      >
        {containerType === "main" ? replyComponent() : null}
        {!isSameUser(currentMessage, previousMessage)
          ? renderUsernameHandle()
          : null}
        <TouchableWithoutFeedback
          onPress={() => onPressMessage()}
          onLongPress={() => onLongPressHandle()}
          accessibilityTraits="text"
          {...props.touchableProps}
        >
          <View>
            {renderBubbleContent()}
            <View
              style={[
                styles[position].bottom,
                bottomContainerStyle && bottomContainerStyle[position],
              ]}
            >
              <View
                style={{
                  flexDirection: position === "left" ? "row-reverse" : "row",
                  alignItems: "center",
                }}
              >
                {!!currentMessage.isEdited && isEditedComponent()}
                {renderTokenCount()}
                {renderTimeHandle()}
                {/* {renderTicksHandle()} */}
              </View>
            </View>

            <View></View>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
      {renderQuickReplies()}
      {renderReplyCount()}
    </View>
  )
})

export default Bubble

// Note: Everything is forced to be "left" positioned with this component.
// The "right" position is only used in the default Bubble.
const styles = {
  left: StyleSheet.create({
    container: {
      marginTop: 2,
    },
    replyWrapper: {
      borderRadius: 15,
      padding: 5,
      borderLeftWidth: 2,
      borderColor: colors.leftBubbleBackground,
      borderWidth: 2,
      borderBottomWidth: 0,
    },
    editWraper: {
      alignItems: "flex-end",
      justifyContent: "center",
      paddingBottom: 5,
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: colors.leftBubbleBackground,
      marginRight: 60,
      minHeight: 20,
      justifyContent: "flex-end",
      minWidth: 100,
    },
    tokenContainerStyle: {
      flexDirection: "row",
      marginRight: 10,
      marginBottom: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    tokenIconStyle: {
      height: hp("2%"),
      width: hp("2%"),
    },
    tokenTextStyle: {
      color: colors.white,
      fontFamily: textStyles.regularFont,
      fontSize: 10,
      fontWeight: "bold",
      backgroundColor: "transparent",
      textAlign: "right",
    },
    numberOfRepliesContainerStyle: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    containerToNext: {
      borderBottomLeftRadius: 3,
    },
    containerToPrevious: {
      borderTopLeftRadius: 3,
    },
    bottom: {
      flexDirection: "row",
      justifyContent: "flex-start",
    },
  }),
  right: StyleSheet.create({
    container: {
      marginTop: 2,
    },
    editWraper: {
      alignItems: "flex-start",
      justifyContent: "center",
      paddingBottom: 5,
    },
    replyWrapper: {
      borderTopRightRadius: 15,
      borderTopLeftRadius: 15,
      padding: 2,
      borderLeftWidth: 2,
      borderWidth: 2,
      borderColor: colors.defaultBlue,
      borderBottomWidth: 0,
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: colors.defaultBlue,
      marginLeft: 60,
      minHeight: 20,
      justifyContent: "flex-end",
      minWidth: 100,
    },
    containerToNext: {
      borderBottomRightRadius: 3,
    },
    tokenContainerStyle: {
      flexDirection: "row",
      marginLeft: 10,
      marginBottom: 5,
      justifyContent: "flex-end",
      alignItems: "center",
    },
    tokenIconStyle: {
      height: hp("2%"),
      width: hp("2%"),
    },
    tokenTextStyle: {
      color: colors.white,
      fontFamily: textStyles.regularFont,
      fontSize: 10,
      fontWeight: "bold",
      backgroundColor: "transparent",
      textAlign: "right",
    },
    numberOfRepliesContainerStyle: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    containerToPrevious: {
      borderTopRightRadius: 3,
    },
    bottom: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
  }),
  content: StyleSheet.create({
    tick: {
      fontFamily: textStyles.regularFont,
      fontSize: 10,
      backgroundColor: colors.backgroundTransparent,
      color: colors.white,
    },
    tickView: {
      flexDirection: "row",
      marginRight: 10,
    },
    username: {
      top: -3,
      left: 0,
      fontSize: 12,
      backgroundColor: "transparent",
      color: "#aaa",
    },
    usernameView: {
      flexDirection: "row",
      marginHorizontal: 10,
    },
    userTextStyleLeft: {
      fontFamily: textStyles.regularFont,
      color: "#FFFF",
    },
  }),
}
