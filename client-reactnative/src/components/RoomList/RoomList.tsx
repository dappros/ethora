/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { observer } from "mobx-react-lite"
import React, { useEffect, useRef, useState } from "react"
import { useStores } from "../../stores/context"
import { RoomListItem } from "./RoomListItem"
import { View, VStack, Text, HStack, Box, Avatar } from "native-base"
import {
  Animated,
  Dimensions,
  FlatList,
  PanResponder,
  TextInput,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { HomeStackNavigationProp as HomeStackNavigationProperty } from "../../navigation/types"
import { roomListProps as roomListProperties } from "../../stores/chatStore"
import { defaultMetaRoom, ROOM_KEYS, textStyles } from "../../../docs/config"
import { httpGet } from "../../config/apiService"
import { homeStackRoutes } from "../../navigation/routes"
import { TouchableOpacity } from "react-native-gesture-handler"
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from "react-native-responsive-screen"
import { HeaderMenu } from "../MainHeader/HeaderMenu"
import Icon from "react-native-vector-icons/FontAwesome"
import RoomsCategories from "./RoomsCategories"
import RoomsHeader from "./RoomsHeader"

interface IRoomList {
  roomsList: roomListProperties[]
}

export const RoomList: React.FC<IRoomList> = observer(
  (properties: IRoomList) => {
    const { chatStore, apiStore, loginStore } = useStores()
    const { roomsList } = properties
    const sortedRoomsList = roomsList.sort(
      (a: any, b: any) =>
        chatStore.roomsInfoMap[a.jid]?.priority -
        chatStore.roomsInfoMap[b.jid]?.priority
    )
    const [allRooms, setAllRooms] = useState([...chatStore.roomList])
    const navigation = useNavigation<HomeStackNavigationProperty>()

    const scrollY = useRef(new Animated.Value(0)).current
    //
    // useEffect(() => {
    //   const scrollListener = scrollY.addListener(({ value }) => {
    //     // You can adjust the threshold based on your needs
    //     setShowCreateButton(value < 0);
    //   });
    //
    //   return () => {
    //     scrollY.removeAllListeners();
    //   };
    // }, [scrollY]);
    //

    const panY = useRef(new Animated.Value(0)).current
    const [showCreateRoom, setShowCreateRoom] = useState(false)

    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.dy > 0) {
          setShowCreateRoom(true)
          Animated.event([null, { dy: panY }], {
            useNativeDriver: false,
          })(event, gestureState)
        } else {
          setShowCreateRoom(false)
          Animated.event([null, { dy: panY }], {
            useNativeDriver: false,
          })(event, gestureState)
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          // Swipe down logic, e.g., show new content or navigate to a new screen
        } else if (gestureState.dy < -50) {
          // Swipe up logic, e.g., hide new content or navigate back
        }
        Animated.spring(panY, {
          toValue: 0,
          useNativeDriver: false,
          tension: 10, // Adjust the tension value for a smoother appearance
        }).start()
      },
    })
    const [isFocused, setIsFocused] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [placeholderAnimationEnded, setPlaceholderAnimationEnded] =
      useState(false)
    const handleSearchFocus = () => setIsFocused(true)
    const handleSearchBlur = () => {
      if (!searchValue) setIsFocused(false)
    }
    const inputReference = useRef(null)
    const placeholderAnim = useRef(new Animated.Value(0)).current
    const screenWidth = Dimensions.get("window").width

    useEffect(() => {
      const placeholderMoveAnimation = Animated.timing(placeholderAnim, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      })
      // placeholderMoveAnimation.start()
      placeholderMoveAnimation.start(({ finished }) => {
        if (finished) {
          setPlaceholderAnimationEnded(isFocused)
        }
      })
      return () => {
        placeholderMoveAnimation.stop()
      }
    }, [isFocused, placeholderAnim])

    const translateX = placeholderAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [widthPercentageToDP("-5%"), widthPercentageToDP("-33%")], // Adjust the value based on your desired movement
      // outputRange: [-10, -100], // Adjust the value based on your desired movement
    })

    console.log("allrooms", allRooms)

    const handleSearchChange = (value) => {
      setSearchValue(value)
      const newRooms = [...chatStore.roomList]
      setAllRooms(newRooms.filter((room) => room.name.includes(value)))
    }

    console.log("searchValue", searchValue)
    const createRoomBlock = (
      <View paddingLeft={4} paddingRight={4} width={"full"}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            width: "100%",
            borderRadius: 25,
            position: "relative",
          }}
        >
          <Animated.View
            style={[
              {
                position: "absolute",
                left: "50%", // Adjust the initial position based on your design
              },
              { transform: [{ translateX }] },
            ]}
          >
            <Text style={{ color: "gray", opacity: searchValue ? 0 : 1 }}>
              Search..
            </Text>

            <Icon
              name="search"
              style={{ position: "absolute", top: -3, left: -35 }}
              size={24}
              color="#888"
            />
          </Animated.View>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <TextInput
              ref={inputReference}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              onChangeText={handleSearchChange}
              value={searchValue}
              style={{
                paddingLeft: 46,
                width: "100%",
                height: 45,
                paddingRight: 15,
              }}
              caretHidden={!placeholderAnimationEnded}
            />
          </View>
        </View>
        <TouchableOpacity
          style={{
            marginTop: 10,
            marginBottom: 20,
            backgroundColor: "#0052CD",
            height: 45,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
          }}
          onPress={() => navigation.navigate("NewChatScreen")}
        >
          <HStack space={2} alignItems={"center"} justifyContent={"center"}>
            <Icon name="plus" size={9} color="#fff" />
            <Text style={{ color: "#fff" }}>New chat</Text>
          </HStack>
        </TouchableOpacity>
      </View>
    )

    const translateY = panY.interpolate({
      inputRange: [-300, 0, 300],
      outputRange: [-50, 0, 50],
      extrapolate: "clamp",
    })
    // /*{...panResponder.panHandlers}*/

    return (
      <>
        <View
          flex={1}
          // style={{
          //   flex: 1,
          //   justifyContent: "center",
          //   alignItems: "center",
          //   transform: [{ translateY }],
          // }}
        >
          <View
            justifyContent={"center"}
            alignItems={"center"}
            w={"full"}
            flex={1}
          >
            <RoomsHeader />
            <View paddingTop={100}>
              {createRoomBlock}
              {searchValue && <RoomsCategories />}
            </View>
            <FlatList
              nestedScrollEnabled={true}
              style={{ width: "100%" }}
              data={searchValue ? allRooms : sortedRoomsList}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
              // onScrollBeginDrag={() => setShowCreateButton(true)}
              // onScrollEndDrag={() => setShowCreateButton(false)} //
              // ListFooterComponent={<View style={{ height: 80 }} />}
              // onEndReached={() => setShowCreateButton(true)}
              onEndReachedThreshold={0.1} //
              keyExtractor={(item: any) => `${item.jid}`}
              renderItem={({ item, index }) => {
                return (
                  <RoomListItem
                    index={index}
                    length={sortedRoomsList.length}
                    counter={item.counter}
                    jid={item.jid}
                    name={item.name}
                    participants={item.participants}
                    key={item.jid}
                  />
                )
              }}
            />
          </View>
        </View>
      </>
    )
  }
)
