/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React, { useRef, useState } from "react"
import {
  Text,
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ImageBackground,
} from "react-native"
import { Swipeable } from "react-native-gesture-handler"
import { commonColors, textStyles } from "../../../docs/config"
import { LeftActions, RightActions } from "./LeftAndRightDragAction"
import IonIcon from "react-native-vector-icons/Ionicons"
import MaterialIcon from "react-native-vector-icons/MaterialIcons"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import moment from "moment"

interface ChatDragItemProps {
  item: any
  openChat: any
  drag: any
  leaveChat: any
  renameChat: any
  unsubscribeFromRoom: any
  movingActive: any
  index: any
  activeMenuIndex: any
}

const ChatDragItem = (props: ChatDragItemProps) => {
  const ref = useRef()

  const [animation, setAnimation] = useState(new Animated.Value(0))
  const {
    item,
    openChat,
    drag,
    leaveChat,
    unsubscribeFromRoom,
    movingActive,
    renameChat,
    index,
  } = props

  return (
    <Swipeable
      ref={ref}
      renderLeftActions={() => (
        <LeftActions
          item={item}
          ref={ref}
          renameChat={renameChat}
          unsubscribeFromRoom={unsubscribeFromRoom}
        />
      )}
      renderRightActions={() => (
        <RightActions item={item} leaveChat={leaveChat} ref={ref} />
      )}
    >
      {/* <ChatHomeItem onItemPress={() => openChat(item.jid, item.name)} onItemLongPress={drag} item={item} /> */}
      <Animated.View style={{ transform: [{ translateX: animation }] }}>
        <TouchableOpacity
          onPress={() => openChat(item.jid, item.name)}
          activeOpacity={0.6}
          onLongPress={() => movingActive && drag()}
          style={{
            backgroundColor: activeMenuIndex === index ? "lightgrey" : "white",
          }}
          key={index}
        >
          <View style={styles.container}>
            <View
              style={{
                flex: 0.2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {item.counter ? (
                <View style={styles.counterContainer}>
                  <View style={styles.counterInnerContainer}>
                    <Text
                      style={{
                        fontFamily: textStyles.regularFont,
                        fontSize: hp("1%"),

                        color: "#FFFFFF",
                      }}
                    >
                      {item.counter}
                    </Text>
                  </View>
                </View>
              ) : null}
              <ImageBackground
                imageStyle={{ borderRadius: 5 }}
                style={styles.imageBg}
              >
                <View style={styles.chatHomeItemIcon}>
                  <Text style={styles.fullName}>
                    {" "}
                    {item.name[0] + (item.name[1] ? item.name[1] : "")}
                  </Text>
                </View>
              </ImageBackground>
            </View>

            <View
              style={{
                justifyContent: "center",
                marginLeft: wp("0.1%"),
                flex: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Text numberOfLines={1} style={styles.textName}>
                  {item.name}
                </Text>
                {item.muted && (
                  <IonIcon
                    name="volume-mute-outline"
                    size={hp("2%")}
                    style={{
                      marginRight: hp("0.9%"),
                      marginLeft: wp("1%"),
                    }}
                  />
                )}
              </View>

              {item.lastUserName ? (
                <View style={{ flexDirection: "row", marginTop: hp("0.8%") }}>
                  <Text numberOfLines={1} style={styles.lastNameText}>
                    {item.lastUserName}:{" "}
                  </Text>
                  <Text numberOfLines={1} style={styles.lastUserText}>
                    {item.lastUserText}
                  </Text>
                  <Text style={styles.date}>
                    {moment(item.createdAt).format("HH:mm")}
                  </Text>
                </View>
              ) : (
                <Text numberOfLines={1} style={styles.noInfo}>
                  Join this chat to view updates
                </Text>
              )}
            </View>
            <View style={{ flex: 0.17 }}>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={{ height: hp("3.8%"), width: wp("15%") }}>
                  <View style={styles.chatHomeItemParticipants}>
                    <MaterialIcon
                      name="group"
                      size={hp("2%")}
                      style={{
                        marginRight: hp("0.9%"),
                        marginLeft: hp("0.4%"),
                      }}
                    />
                    <Text
                      style={{
                        fontSize: hp("1.5%"),
                        fontFamily: textStyles.regularFont,
                      }}
                    >
                      {item.participants}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Swipeable>
  )
}

export default ChatDragItem

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 20,
    alignItems: "center",
    marginRight: 0,
    marginLeft: 0,
  },
  counterContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    flex: 1,
    zIndex: 1,
    alignSelf: "flex-end",
    height: hp("5.5%"),
    width: hp("5.5%"),
    marginTop: hp("1%"),
    marginRight: hp("0.5"),
  },
  counterInnerContainer: {
    height: hp("2.1%"),
    width: hp("2.1%"),
    borderRadius: hp("2.1") / 2,
    backgroundColor: "#FF0000",
    alignItems: "center",
    justifyContent: "center",
  },
  imageBg: {
    height: hp("5.5%"),
    width: hp("5.5%"),
    // flex: 1,
    borderRadius: 5,
    position: "absolute",
  },
  chatHomeItemIcon: {
    borderWidth: 1,
    borderColor: commonColors.primaryDarkColor,
    backgroundColor: commonColors.primaryDarkColor,
    height: hp("5.54%"),
    width: hp("5.54%"),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    position: "relative",
    borderRadius: hp("0.7%"),
  },
  fullName: {
    color: "white",
    marginRight: 3,
    //   fontFamily: mediumRobotoFont,
    textTransform: "uppercase",
    textAlign: "center",
  },
  textName: {
    fontFamily: textStyles.mediumFont,
    fontSize: hp("2%"),
    color: "#4C5264",
    justifyContent: "center",
    alignItems: "center",
  },
  lastNameText: {
    fontFamily: textStyles.regularFont,
    fontSize: hp("1.8%"),
    color: "#4C5264",
  },
  lastUserText: {
    fontFamily: textStyles.thinFont,
    fontSize: hp("1.8%"),
    color: "#4C5264",
    width: wp("30%"),
  },
  noInfo: {
    fontFamily: textStyles.thinFont,
    fontSize: hp("1.8%"),
    color: "#4C5264",
  },
  date: {
    fontFamily: textStyles.regularFont,
    fontSize: hp("1.2%"),
    position: "absolute",
    right: -25,
    // flex: 1,
    color: "#BCC5D3",
    marginTop: hp("0.6%"),
  },
  chatHomeItemParticipants: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 10,
    shadowOffset: { width: -1, height: 1 },
    shadowColor: commonColors.primaryColor,
    shadowOpacity: 1.0,
    borderWidth: 1,
    borderColor: "white",
    shadowRadius: 1,
    backgroundColor: "white",

    height: 20,
    width: 40,
  },
})
